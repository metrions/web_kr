import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate} from "react-router-dom";

const TextsPanel = () => {
    const navigate = useNavigate();
    const [texts, setTexts] = React.useState([]);

    useEffect(() => {
        console.log('Making GET request');
        axios.get(process.env.REACT_APP_BACKEND + "/getTexts")
            .then(response => {
                console.log('Response received:', response);
                setTexts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the texts!", error);
            });
    }, []);

    const createNewText = async () => {
        const uuid = await axios.post(process.env.REACT_APP_BACKEND +"/createText")
            .then(response => {
                setTexts(prev => [...prev, response.data]);
                return response.data;
            })
            .catch(error => {
                console.error("Exception", error);
            });
        navigate(`/text/${uuid.id}`);
    }

    const deleteText = async (uuid) => {
        axios.delete(process.env.REACT_APP_BACKEND+ "/delete?id=" + uuid).catch(error => {
                console.error("Exception", error);
            });
        setTexts(prevTexts => prevTexts.filter(text => text.id !== uuid));
    }


    return (
        <div>
            <ul style={{display: "flex", flexWrap: "wrap", padding: "0", margin: "0"}}>
                <li style={{width: "100px", marginRight: "10px", marginBottom: "20px"}}>
                    <img onClick={createNewText} style={{width: "100px", height: "100px", border: "1px solid #555"}}
                         src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt=""/>
                    <h6>Создать новый текстовый документ</h6>
                </li>
                {texts.length === 0 ? (
                    <li>Loading...</li>
                ) : (
                    texts.map((text, index) => (
                        <li style={{width: "100px", marginRight: "10px", marginBottom: "20px"}} key={index}>
                            <img style={{width: "100px", height: "100px", border: "1px solid #555"}}
                                 src="https://www.gstatic.com/images/branding/product/1x/docs_2020q4_48dp.png"
                                 alt="Navigate to text"
                                 onClick={() => navigate(`/text/${text.id}`)}
                            />
                            <button onClick={() => deleteText(text.id)}>Удалить</button>
                            <h6>{text.title}</h6>
                        </li>
                    ))
                )}
            </ul>
        </div>


    );
};

export default TextsPanel;
