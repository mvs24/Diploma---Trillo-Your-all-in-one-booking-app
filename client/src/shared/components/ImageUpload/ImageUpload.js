import React, { useRef, useState, useEffect } from 'react';

import Button from '../Button/Button';
import './ImageUpload.css';
import InlineButton from '../InlineButton/InlineButton'

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(pickedFile, fileIsValid, previewUrl);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className={`form-control ${props.inline && 'inline__btn--container'}`}>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload  ${props.center && 'center'}`}>
       {props.inline ? <InlineButton disabled={props.disabled} className='inline__btn--img' clicked={pickImageHandler}>
        {props.title ? props.title : 'Choose a new photo'}
       </InlineButton> : <Button type="success" clicked={pickImageHandler}>
          {props.title ? props.title : 'Choose a new photo'}
        </Button>
      }
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};
export default ImageUpload;
