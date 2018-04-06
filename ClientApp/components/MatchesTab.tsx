import * as React from "react";
import { observer } from "mobx-react";
import { Match, Chromosome } from "../stores/chromosome-store";
import * as _ from 'lodash';

@observer
export default class MatchesTab extends React.Component<{items: Array<Match>; showSharedChromosomes: boolean;}>  {

    getCommonChromosomesNode(match: Match) {
        var entries: Array<{match: Match, chromosomes: Chromosome[]}>= [];
        match.commonChromosomes.forEach((value, key, map) => {
            if (value.length > 0) {
                entries.push({
                    match: key,
                    chromosomes: value
                });
            }
        });

        return (<ul>
            {entries.map(entry => (
                <li>{entry.match.matchName} (#{entry.chromosomes.length} shared chromosomes)</li>
            ))}
        </ul>);
    }

    render() {
        var { showSharedChromosomes, items } = this.props;
        return <ul>
            { _.orderBy(items, x => x.centimorgans, 'desc').map((match, index) => (
                <li key={index}>
                    {match.matchName} ({match.chromosomes.length} chromosomes, {match.centimorgans} centimorgans)
                    { showSharedChromosomes && this.getCommonChromosomesNode(match) }
                </li>
            )) }
        </ul>
    }
}