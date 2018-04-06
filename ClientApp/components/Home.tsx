import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { Tabs, Tab, Button } from 'react-bootstrap';
import csv from 'csvtojson';
import * as _ from 'lodash';
import ChromosomeStore from '../stores/chromosome-store';

import ChromosomeTab from './ChromosomeTab';
import MatchesTab from './MatchesTab';
//import * as calc from './../service/calculator';

const CSV_OPTIONS = {
    headers: [ 'name', 'matchName', 'chromosome', 'locationStart', 'locationEnd', 'centimorgans', 'snps' ]
}

// TODO - Refactor into the router
let store = new ChromosomeStore();

@observer
export class Home extends React.Component<RouteComponentProps<any>, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            minCentimorgans: 7,
            chromosomes: [],
            matches: []
        }
    }

    receiveFileDrops(files: Array<any>, rejects: Array<File>) {
        var reader = new FileReader();
        let component = this;

        reader.onload = (e: any) => {
            var entries = [];
            csv(CSV_OPTIONS).fromString(e.target.result)
                .on('json', json => {
                    entries.push(json);
                })
                .on('done', () => {
                    store.chromosomes = entries;
                })
        }
        
        files.forEach(file => {
            reader.readAsText(file);
        });
    }

    public calculateSharedMatches() {
        store.populateMatchesWithMatrix();
    }

    public render() {
        return <div>
            <Dropzone multiple accept="text/csv" onDrop={this.receiveFileDrops.bind(this)}>
                Click or drop file(s) here to begin
            </Dropzone>
            <input min="0" type="number" value={store.minCentimorgans} onChange={e => { store.minCentimorgans = Number(e.target.value); }} />
            { store.isReady &&
            <div>
                <Button onClick={this.calculateSharedMatches.bind(this)} bsStyle="primary" bsSize="large">Start Calculating Matches With Shared Chromosomes</Button>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Matches">
                        <MatchesTab items={store.matches} showSharedChromosomes={store.showSharedChromosomes} />
                    </Tab>
                    <Tab eventKey={2} title="Chromosomes">
                        <ChromosomeTab items={store.filteredChromosomes} />
                    </Tab>
                </Tabs>
            </div>
            }
        </div>;
    }
}
