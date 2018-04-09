import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';
import Dropzone from 'react-dropzone';
import { Tabs, Tab, Button, Modal } from 'react-bootstrap';
import csv from 'csvtojson';
import * as _ from 'lodash';
import ChromosomeStore from '../stores/chromosome-store';

import ChromosomeDataTable from './ChromosomeDataTable';
import Matches from './Matches';
import Filters from './Filters';
import AdvancedSettings from './AdvancedSettings';
//import * as calc from './../service/calculator';

const CSV_OPTIONS = {
    headers: [ 'name', 'matchName', 'chromosome', 'locationStart', 'locationEnd', 'centimorgans', 'snps' ]
}

// TODO - Refactor into the router
let store = new ChromosomeStore();

@observer
export class Home extends React.Component<RouteComponentProps<any>, any> {
    constructor(props) {
        super(props);

        this.state = {
            showAdvancedSettings: false
        };
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
                    store.populateMatchesWithMatrix();
                })
        }
        
        files.forEach(file => {
            reader.readAsText(file);
        });
    }

    public calculateSharedMatches() {
        store.populateMatchesWithMatrix();
    }

    public clearResults() {
        store.chromosomes = [];
    }

    public render() {
        return <div>
            <h1>Data Crunch</h1>
            <h3>Begin by uploading raw chromosome data from FTDNA</h3>
            <div className="pull-right">
            { !store.isReady && <Button onClick={() => { this.setState({showAdvancedSettings: true}); }}>Show Advanced Settings</Button> }
            </div>
            <Dropzone multiple accept="text/csv" onDrop={this.receiveFileDrops.bind(this)}>
                Click or drop file(s) here to begin
            </Dropzone>
            <Modal show={this.state.showAdvancedSettings} onHide={() => { this.setState({showAdvancedSettings: false}); }}>
                <Modal.Header>
                    <Modal.Title>Advanced Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AdvancedSettings store={store} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { this.setState({showAdvancedSettings: false}); }}>Close</Button>
                </Modal.Footer>
            </Modal>
            { store.isReady &&
            <div>
                <div className="pull-right">
                    <Button onClick={this.clearResults.bind(this)}>Clear Results</Button>
                </div>
                <h3>Select relative to explore</h3>
                <Filters store={store} />
                <Matches store={store} />
            </div>
            }
        </div>;
    }
}
