import React, {useState, useEffect} from 'react';
import { Box,  CircularProgress,Backdrop , Typography} from '@mui/material';


import DriveRequest from 'api/driveRequest.jsx';
import ErrorAlert from 'components/dialogs/ErrorAlert';
import ProgessModal from 'components/dialogs/ProgressModal';

export default function ApiRequest( {apiRequest} ) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('------------------ ApiRequest useEffect --------------------', apiRequest );
    setError(null);
    if ( apiRequest ){      
      if( DriveRequest [ apiRequest.command] ){
        setShow(true);
        DriveRequest [ apiRequest.command]( apiRequest.param )
          .then(response => {
            console.log('hello', response);
            setShow(false);
            console.log( apiRequest.command, response );
            if ( apiRequest.callback ) apiRequest.callback(response);
          })
          .catch( error => {
            console.log('>>>>>>>>>>>> REQUEST', error);
            setShow(false);
            setError(error);
          });
      } else {
        console.warn('>>>>>>>>>>>> REQUEST', 'NOT FOUND COMMAND');     
      }

      // DriveRequest['hello'](apiRequest.param)
      //   .then(response => {
      //     setShow(false);
      //     console.log('hello', response);
      //     // eslint-disable-next-line react/prop-types
      //     if (apiRequest.callback) apiRequest.callback(response);
      //   })
      //   .catch( error => {
      //     setShow(false);
      //     console.log('>>>>>>>>>>>>.hello error', error); 
      //     setError(error);
      //   });
      console.log('============ END ApiRequest useEffect ============');
    }
  }, [apiRequest]);

  
  const UIError = ({ error }) => {
    console.log('UIError', error);
    let time = Date.now();
    if ( error !== null ) {
      let resultMessage = '서버에서 오류가 발생했습니다.';
      if( error.response.headers.resultmessage ){
        resultMessage = decodeURI( error.response.headers.resultmessage).replace(/\+/g, ' ');            
      }
      return <ErrorAlert message={resultMessage} time={time} />;
    } else {
      return <></>;
    }
  };

  return (
    <>
      <ProgessModal show={show} />
      <UIError error={error} />
    </>
  );
}
