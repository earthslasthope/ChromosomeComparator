import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Dropzone from 'react-dropzone';
import csv from 'csvtojson';
import _ from 'lodash';
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

    getMatches() {
        
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
        </div>;
    }
}
