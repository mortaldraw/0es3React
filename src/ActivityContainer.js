import React, {Component} from "react";
import ActivityPresentation from "./ActivityPresentation";
import modules from "./data/modules.json";

class ActivityContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            file_markdown: null,
        }

        let module_id = props.match.params.module_id;
        let topic_id = props.match.params.topic_id;
        let page_title = modules[module_id].topics.find(element => element.file === topic_id).name;

        document.title = page_title + " - Moondo Reyes";

        this.file_content = require("./content/" + module_id + "/" + topic_id + "/" + topic_id + ".md");
        this.file_markdown = null;

        this.getFileContent = this.getFileContent.bind(this);
    }

    getFileContent(){
        if(this.file_content.startsWith("data:text/x-markdown;base64,")){
            this.file_content = this.file_content.replace("data:text/x-markdown;base64,", "");
            let decoded_file_content = decodeURIComponent(Array.prototype.map.call(atob(this.file_content), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // This is not an error, as strange as it might look. If this is not
            // done, react will try to update the state in an async manner
            // while its child ActivityPresentation is being constructed.
            // To avoid this, state is changed directly.
            this.state.file_markdown = decoded_file_content;
        } else {
            let self = this;
            fetch(this.file_content).then(resp => {
                return resp.text();
            }).then(data => {
                let decoded_file_content = data;
                self.setState({file_markdown: decoded_file_content});
            });
        }
    }

    render(){
        if(!this.file_markdown) {
            this.getFileContent();
        }

        return <ActivityPresentation data={this.state.file_markdown} />
    }

}

export default ActivityContainer;
