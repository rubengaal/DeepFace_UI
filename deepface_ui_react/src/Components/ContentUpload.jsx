import Button from '@mui/material/Button';
// import SendIcon from '@mui/icons-material/Send';
// import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import React, { Component } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import axios from 'axios';
import background from '../Assets/subbackground.png';

import '../Styles/contentUpload.scss';
import { useState, useEffect } from 'react';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Silkscreen',
            'cursive',
        ].join(','),
    },
});


export const ContentUpload = () => {

    const [image, setImage] = useState('');
    const [rec, setRec] = useState('');

    const options = {
        mode: "no-cors",
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: image
    }



    const onFileChangeHandler = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            setImage(reader.result);
            //console.log(reader.result);
        }

        reader.readAsDataURL(file);

        console.log(image)

        fetch('http://localhost:8090/main/generate', options)
            .then(response => response.json()) // or response.text()
            .then(data => {
                console.log(data)
                this.setState({
                    code: data
                });
            })
            .catch(err => { console.log('error while fetching', err) })


    };

    const onFileUpload = (e) => {
        const formData = new FormData();
        formData.append("myFile", e.target.files[0]);
    
        console.log(e.target.files[0]);
        axios.post("http://localhost:3000/api/uploadfile", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        }); //I need to change this line
      };

    const onGetImageHandler = (e) => {
        e.preventDefault();

        fetch('http://localhost:8090/main/image',
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                console.log(responseData.dataUrl)
                console.log(responseData.mtlUrl)
                console.log(responseData.objUrl)
                //dataURLtoBlob(responseData.objUrl)
                return responseData;

            })
            .catch(error => console.warn(error));

    };


    function dataURLtoBlob(dataurl) {
        var string = dataurl + '';
        var arr = string.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }


    return (
        <div className={"contentupload"} style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
        }}>
            <ThemeProvider theme={theme}>
                <Button id="input1" variant="contained" component="label" endIcon={<CheckCircleSharpIcon />} style={{ display: 'compact', marginTop: 20, borderRadius: 20, textTransform: "none" }} >
                    Upload picture here
                    <input hidden accept="image/*" multiple type="file" onChange={onFileChangeHandler} />
                </Button>

            </ThemeProvider>
        </div>
    )

}


