import * as React from 'react';
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import ChromosomeStore, { Match, Chromosome } from "../stores/chromosome-store";
import { observer } from 'mobx-react';

@observer
export default class AdvancedSettings extends React.Component<{store: ChromosomeStore}> {
    render() {
        const {store} = this.props;

        return <form>
            <FormGroup>
                <ControlLabel>Minimum subsequent centimorgans</ControlLabel>
                <FormControl type="number" min="0" value={store.minCentimorgans} onChange={(e) => { store.minCentimorgans = Number(e.target.value); }} />
            </FormGroup>            
            <FormGroup>
                <ControlLabel>Super match centimorgan threshold</ControlLabel>
                <FormControl type="number" min="0" value={store.superMatchThreshold} onChange={(e) => { store.superMatchThreshold = Number(e.target.value); }} />
            </FormGroup>
        </form>
    }
}