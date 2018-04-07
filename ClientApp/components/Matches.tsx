import * as React from "react";
import { observer } from "mobx-react";
import ChromosomeStore, { Match, Chromosome } from "../stores/chromosome-store";
import * as _ from 'lodash';
import { Modal } from 'react-bootstrap';

@observer
export default class Matches extends React.Component<{store: ChromosomeStore}>  {

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
            {_.orderBy(entries, x => x.match.centimorgans, 'desc').map(entry => (
                <li>{entry.match.matchName} (#{entry.chromosomes.length} shared chromosomes, {entry.match.centimorgans} cM)</li>
            ))}
        </ul>);
    }

    openMatch(match: Match) {
        this.props.store.modalMatch = match;
    }

    closeMatch() {
        this.props.store.modalMatch = null;
    }

    render() {
        var { showSharedChromosomes, matches, modalMatch } = this.props.store;
        return <div>
            { modalMatch &&
            <Modal show={modalMatch} onHide={this.closeMatch.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMatch.matchName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <dl className="dl-horizontal">
                        <dt>Shared Chromosomes</dt>
                        <dd>{modalMatch.chromosomes.length}</dd>

                        <dt>Centimorgans</dt>
                        <dd>{modalMatch.centimorgans}</dd>
                    </dl>
                    <h3>Common Matches</h3>
                    { this.getCommonChromosomesNode(modalMatch) }
                </Modal.Body>
            </Modal>
            }
            <ul>
                { _.orderBy(matches, x => x.centimorgans, 'desc').map((match, index) => (
                    <li key={index}>
                        <a href="#" onClick={this.openMatch.bind(this, match)}>{match.matchName}</a>
                        
                    </li>
                )) }
            </ul>
        </div>
    }
}