import React, {useState, useEffect} from 'react';

// material-ui
import {Button, TextField} from '@mui/material';

// project import
import MainCard from 'components/MainCard';

import FileDocViewer from 'components/frames/FileDocViewer';
import PDFView from 'components/frames/PdfView';

import HWPViewerPage from 'components/frames/HwpView';
import ErrorAlert from 'components/dialogs/ErrorAlert';
import ProgessModal from 'components/dialogs/ProgressModal';
import ApiRequest from 'components/logic/ApiRequest';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(null);  
  const [apiRequest, setApiRequest] = useState(null);
  const [second, setSecond] = useState(3);
  // setTimeout(() => {
  //   setProgessOpen(false);
  // }, 3000);

  return (
    <MainCard title="Sample Card">
      <Button variant="contained" color="primary" onClick={() => {setTick( Date.now() );
        setError('에러 발생');}
      }>에러 발생</Button>

      <Button variant="contained" color="primary" onClick={() => {
        setError('서버에서 처리중 에러 발생');}
      }>에러 발생</Button>
      
      <TextField id="outlined-basic" label="Outlined" variant="outlined" value={second} type="number" onChange={(e)=>{ 
        console.log(e.target.value); 
        setSecond(e.target.value);
      }} />

      <Button variant="contained" color="primary" onClick={() => {
        console.log('second', second);
        setApiRequest({command:'hello', param: 3, callback: (response) => {console.log('callback', response);}});
      }}>CALL HELLO - 3초</Button>

      <Button variant="contained" color="primary" onClick={() => {
        console.log('second', second);
        setApiRequest({command:'hello', param: 11, callback: (response) => {console.log('callback', response);}});
      }}>CALL HELLO - 11초</Button>


      <ApiRequest apiRequest={apiRequest} />
      <HWPViewerPage/>
    </MainCard>
  );
}
