import * as React from "react";
import { observer } from "mobx-react";
import ChromosomeStore, { Match, Chromosome } from "../stores/chromosome-store";
import {FormControl, Checkbox, Panel, FormGroup, InputGroup, Button} from 'react-bootstrap';

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
        let {store} = this.props;
        let {checked} = e.target;

        this.setState({
           isSharedWith: checked 
        }, () => {
            if (store.filter) {
                store.filter.isSharedWith = checked;
            }
        });
    }

    reset() {
        this.props.store.filter = null;
    }

    onNameFilterChange(e) {
        this.props.store.nameFilter = e.target.value;
    }

    render () {
        const { store } = this.props;
        const { superMatches } = store;

        return <Panel>
            <Panel.Body>
                <h5>Filter by namefsdfdsfs</h5>
                <FormGroup>
                    <InputGroup>
                        <FormControl type="text" value={store.nameFilter} onChange={this.onNameFilterChange.bind(this)} />
                        <InputGroup.Button>
                            <Button onClick={() => { store.nameFilter = ''; }}>Clear</Button>
                        </InputGroup.Button>
                    </InputGroup>
                </FormGroup>
                {  /* NOTE: Super Match functionality is broken, hence this section is commented out -- superMatches.length > 0 && <div>
                    <h5>Filter by super match</h5>
                    <Checkbox checked={this.state.isSharedWith} onChange={this.toggleSharedWithFlag.bind(this)}>Include (else exclude)</Checkbox>
                    <FormControl componentClass="select" onChange={this.selectMatch.bind(this)}>
                        <option>-- Select --</option>
                        { superMatches.map((x ,index) => (
                            <option key={index}>{x.matchName}</option>
                        )) }
                    </FormControl>
                </div>
                    */}
            </Panel.Body>
        </Panel>
    }
}