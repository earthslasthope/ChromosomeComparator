import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Table } from 'react-bootstrap';
import { Chromosome } from './../stores/chromosome-store';

export default class ChromosomeDataTable extends React.Component<{items: Array<Chromosome>}> {
    render() {
        return (<Table>
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Match Name</td>
                    <td>Chromosome #</td>
                    <td># Centimorgans</td>
                    <td>Location Start</td>
                    <td>Location End</td>
                </tr>
            </thead>
            <tbody>
                {this.props.items.map((chromosome, index) => (
                    <tr key={index}>
                        <td>{chromosome.name}</td>
                        <td>{chromosome.matchName}</td>
                        <td>{chromosome.chromosome}</td>
                        <td>{chromosome.centimorgans}</td>
                        <td>{chromosome.locationStart}</td>
                        <td>{chromosome.locationEnd}</td>
                    </tr>
                ))}
            </tbody>
        </Table>)
    }
}