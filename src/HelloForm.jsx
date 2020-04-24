const React = require('react');
const { Text, Color, ImageFill } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;

class HelloForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { breed: "", breeds: [], url: null };
        this.breedSelected = (e) => {
            const breed = e.target.value;
            this.setState({ breed: breed })
            fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(res => res.json())
                .then(image => {
                    this.setState({ url: image.message });
                });
        }

        this.anotherDog = () => {
            const breed = this.state.breed;
            this.setState({ url: null });

            fetch(`https://dog.ceo/api/breed/${breed}/images/random`).then(res => res.json())
                .then(image => {
                    this.setState({ url: image.message });
                });
        }
        this.onDoneClick = async (e) => {
            const selection = this.props.selection;
            // TODO create image with url
            const newText = new Text();
            newText.text = this.state.breed;
            newText.styleRanges = [{
                length: newText.text.length,
                fill: new Color("#00F"),
                fontSize: 50
            }];
            // selection.insertionParent.addChild(newText);
            // newText.moveInParentCoordinates(100, 100);

            
            let imageFile = await fs.getFileForOpening({ types: storage.fileTypes.images });

            // Set fill of first selected item
            // const fill = new ImageFill(this.state.url);
            const fill = new ImageFill(imageFile);
            selection.items[0].fill = fill;
            props.dialog.close();
        }
    }

    componentDidMount() {
        fetch("https://dog.ceo/api/breeds/list/all").then(res => res.json())
            .then(breeds => {
                const br = Object.keys(breeds.message)
                this.setState({ breeds: br });
            });
    }

    render() {
        return (
            <form style={{ width: 300 }} onSubmit={this.onDoneClick}>
                <h1>Random dog photo</h1>
                <label >Pick a breed</label>
                <select onChange={this.breedSelected}>
                    {this.state.breeds.map(breed =>
                        <option value={breed}>{breed[0].toUpperCase() + breed.slice(1)}</option>
                    )}
                </select>
                {this.state.url &&
                    <div>
                        <img src={this.state.url} />
                        <p>If you don't like this doggy (😔) you can select <button onClick={this.anotherDog}>another</button></p>
                    </div>
                }
                <footer>
                    <button disabled={!this.state.url} type="submit" uxp-variant="cta">Add doggy!</button>
                </footer>
            </form>
        );
    }
}

module.exports = HelloForm;