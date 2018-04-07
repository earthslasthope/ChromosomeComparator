import * as React from "react";
import { observer } from "mobx-react";
import ChromosomeStore, { Match, Chromosome } from "../stores/chromosome-store";
import {FormControl, Checkbox, Panel} from 'react-bootstrap';

@observer
export default class Filters extends React.Component<{store: ChromosomeStore}, {isSharedWith: boolean}>  {

    constructor(props) {
        super(props);

        this.state = {
            isSharedWith: false
        };
    }

    selectMatch(match: Match) {
        this.props.store.filter = {
            match: match,
            isSharedWith: this.state.isSharedWith
        };
    }

    toggleSharedWithFlag(e) {
        this.setState({
           isSharedWith: e.target.checked 
        });
    }

    reset() {
        this.props.store.filter = null;
    }

    render () {
        const { superMatches } = this.props.store;

        return <Panel>
            <Panel.Body>
                <h5>Filter by super match</h5>
                <Checkbox checked={this.state.isSharedWith} onChecked={this.toggleSharedWithFlag.bind(this)}>Include (else exclude)</Checkbox>
                <FormControl componentClass="select">
                    <option onSelect={this.reset.bind(this)}>-- Select --</option>
                    { superMatches.map(x => (
                        <option onSelect={this.selectMatch.bind(this, x)}>{x.matchName}</option>
                    )) }
                </FormControl>
            </Panel.Body>
        </Panel>
    }
}