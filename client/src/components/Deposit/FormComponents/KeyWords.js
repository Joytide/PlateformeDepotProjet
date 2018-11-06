import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { FormGroup, Label, Row, Col } from "reactstrap";
import ChipInput from 'material-ui-chip-input';
import i18n from '../../i18n';
class KeyWords extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tags: this.props.tags ? this.props.tags : [],                           //{ id: 1, text: "Big Data" }, { id: 2, text: "BlockChain" }, { id: 3, text: "Aeronautique" }
            suggestions: ["Test", "Test2"]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        console.log(this.props)
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({ tags: tags });
        this.props.change(this.state.tags);
    }

    handleAddition(tag) {
        console.log("Add")
        let tags = this.state.tags;
        tags.push(tag)
        this.setState({ tags: tags });
        this.props.change(this.state.tags);
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render 
        this.setState({ tags: tags });
        this.props.change(this.state.tags);
    }

    render() {
        const lng = this.props.lng;
        const { tags, suggestions } = this.state;
        return (
            <ChipInput lng={lng} 
                  value={this.state.tags}
                  onRequestAdd={(chip) => this.handleAddition(chip)}
                  onRequestDelete={(chip, index) => this.handleDelete(index)}
                  fullWidth
                  fullWidthInput
                  floatingLabelText={i18n.t('keyword.label',{lng}) }
                  dataSource = {this.state.suggestions}
                />
        )
    };
}

export default KeyWords;
