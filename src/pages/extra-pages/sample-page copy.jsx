import React, {useState, useEffect} from 'react';

// material-ui
import {Button, Typography} from '@mui/material';

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
  const [ProgessOpen, setProgessOpen] = useState(true);
  const [ProgessMessage, setProgessMessage] = useState('....데이터 처리중...');

  setTimeout(() => {
    setProgessOpen(false);
  }, 3000);

  return (
    <MainCard title="Sample Card">
      <Button variant="contained" color="primary" onClick={() => {setTick( Date.now() );
        setError('에러 발생');}
      }>에러 발생</Button>

      <Button variant="contained" color="primary" onClick={() => {
        setError('서버에서 처리중 에러 발생');}
      }>에러 발생</Button>
      
      <HWPViewerPage/>
      <ErrorAlert time={tick} message={error} />
      <ProgessModal show={ProgessOpen} message="....데이터 처리중..." />
    </MainCard>
  );
}
