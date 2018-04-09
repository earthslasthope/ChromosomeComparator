import { observable, computed, reaction } from 'mobx';
import * as _ from 'lodash';

export interface Chromosome {
    name: string;
    matchName: string;
    chromosome: number;
    locationStart: number;
    locationEnd: number;
    centimorgans: number;
}

export interface Match {
    matchName: string;
    centimorgans: number;
    chromosomes: Array<Chromosome>;
    commonChromosomes?: Map<Match, Chromosome[]>;
}

export interface Filter {
    match: Match;
    isSharedWith: boolean;
}

export default class ChromosomeStore {

    constructor() {
        let root = this;

        // reaction(() => this.filteredMatches, () => {
        //     root.populateMatchesWithMatrix();
        // });
    }

    @observable minCentimorgans: number = 5;
    @observable superMatchThreshold: number = 1000;
    @observable chromosomes: Array<Chromosome> = [];
    @observable showSharedChromosomes: boolean = false;
    @observable modalMatch?: Match = null;
    @observable sortField: string = 'centimorgans';
    @observable sortDirection?: string = 'desc';
    @observable filter?: Filter;
    @observable nameFilter: string = '';

    @computed get filteredChromosomes(): Array<Chromosome> {
        return _.filter(this.chromosomes, x => x.centimorgans >= this.minCentimorgans);
    }

    @computed get isReady(): boolean {
        return this.chromosomes.length > 0;
    }

    @computed get matches(): Array<Match> {
        var grouped = _.groupBy(this.filteredChromosomes, x => x.matchName);
        var result = [];
        let root = this;

        _.forEach(grouped, (item, key) => {
            let centimorgans = _.sumBy(_.filter(item, x => Number(x.centimorgans) >= root.minCentimorgans), x => Number(x.centimorgans));
            result.push({
                matchName: key,
                chromosomes: item,
                centimorgans: _.round(centimorgans, 1)
            });
        });

        return _.orderBy(result, this.sortField, this.sortDirection);
    }

    @computed get filteredMatches(): Array<Match> {
        var result = this.matches;

        if (this.nameFilter) {
            result = _.filter(result, x => x.matchName.indexOf(this.nameFilter) > -1);
        }

        if (this.filter) {
            if (this.filter.isSharedWith) {
                result = _.filter(result, x => x.commonChromosomes.has(this.filter.match));
            }
            else {
                result = _.filter(result, x => !x.commonChromosomes.has(this.filter.match));
            }
        }

        return result;
    }

    @computed get superMatches(): Array<Match> {
        return _.filter(this.matches, x => x.centimorgans >= this.superMatchThreshold);
    }

    populateMatchesWithMatrix () {
        var matrix = this.buildMatrix();

        _.forEach(this.filteredMatches, match => {
            match.commonChromosomes = matrix.get(match);
        })

        this.showSharedChromosomes = true;
    }

    buildMatrix (): Map<Match, Map<Match,Chromosome[]>> {
        let root = this;
        var outerMap = new Map<Match, Map<Match,Chromosome[]>>();

        this.filteredMatches.forEach(matchA => {
            var innerMap = new Map<Match, Chromosome[]>();
            this.filteredMatches.forEach(matchB => {
                if (matchA !== matchB) {
                    var matchBMap = outerMap.get(matchB);
                    var chromosomes = matchBMap && matchBMap.get(matchA);

                    if (!chromosomes) {
                        chromosomes = _.filter(matchB.chromosomes, chromosomeA => {
                            return _.some(matchA.chromosomes, chromosomeB => {
                                return chromosomeA.chromosome === chromosomeB.chromosome &&
                                    chromosomeA.centimorgans >= root.minCentimorgans &&
                                    chromosomeB.centimorgans >= root.minCentimorgans &&
                                    ((chromosomeA.locationStart >= chromosomeB.locationStart && 
                                    chromosomeA.locationStart <= chromosomeB.locationEnd ) ||
                                    (chromosomeB.locationStart >= chromosomeA.locationStart && 
                                    chromosomeB.locationStart <= chromosomeA.locationEnd) ||
                                    (chromosomeA.locationEnd >= chromosomeB.locationStart && 
                                    chromosomeA.locationEnd <= chromosomeB.locationEnd ) ||
                                    (chromosomeB.locationEnd >= chromosomeA.locationStart && 
                                    chromosomeB.locationEnd <= chromosomeA.locationEnd));
                            });
                        });
                    }

                    innerMap.set(matchB, chromosomes);
                }
            });
            outerMap.set(matchA, innerMap);
        });

        return outerMap;
    }
}