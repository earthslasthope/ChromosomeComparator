import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Dropzone from 'react-dropzone';
import { Tabs, Tab } from 'react-bootstrap';
import csv from 'csvtojson';
import * as _ from 'lodash';
//import * as calc from './../service/calculator';

const CSV_OPTIONS = {
    headers: [ 'name', 'matchName', 'chromosome', 'locationStart', 'locationEnd', 'centimorgans', 'snps' ]
}

export class Home extends React.Component<RouteComponentProps<any>, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            minCentimorgans: 7,
            chromosomes: []
        }
    }

    getMatches(): Array<any> {
        var grouped = _.groupBy(this.state.chromosomes, 'matchName');
        return _.toArray(grouped);
    }

    receiveFileDrops(files: Array<any>, rejects: Array<File>) {
        var reader = new FileReader();
        let component = this;

        reader.onload = (e: any) => {
            csv(CSV_OPTIONS).fromString(e.target.result)
                .on('json', json => {
                    let chromosome = json;
                    let { chromosomes, minCentimorgans } = component.state;

                    console.log(chromosome);
                    if (chromosome.centimorgans >= minCentimorgans) {
                        component.setState({
                            chromosomes: [...chromosomes, json]
                        });
                    }
                });
        }
        
        files.forEach(file => {
            reader.readAsText(file);
        });
    }

    public render() {
        return <div>
            <Dropzone multiple accept="text/csv" onDrop={this.receiveFileDrops.bind(this)}>
                Click or drop file(s) here to begin
            </Dropzone>
            { this.state.chromosomes.length > 0 &&
            <Tabs defaultActiveKey={1}>
                <Tab eventKey={1} title="Matches">
                    {/* <ul> */}
                        { this.getMatches().forEach(match => (
                            <li>{match.matchName}</li>
                        )) }
                    {/* </ul> */}
                </Tab>
            </Tabs>
            }
        </div>;
    }
}
