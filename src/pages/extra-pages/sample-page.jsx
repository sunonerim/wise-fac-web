// material-ui
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

import FileDocViewer from 'components/frames/FileDocViewer';
import PDFView from 'components/frames/PdfView';

import HWPViewerPage from 'components/frames/HwpView';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <MainCard title="Sample Card">
      <HWPViewerPage/>
    </MainCard>
  );
}
