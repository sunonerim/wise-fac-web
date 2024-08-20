import * as React from 'react';
import { Button, Divider, ButtonGroup, Box, Slide } from '@mui/material';
import { Document, Page } from "react-pdf";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//======================= DocViewDialog =======================
export default function PdfView( { docUrl}) {    
  const [numPages, setNumPages] = React.useState(1);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [scale, setScale] = React.useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
  setNumPages(numPages);
  };

  const onDocumentError = (error) => {
  console.error("pdf viewer error", error);
  };

  const onDocumentLocked = () => {
  console.error("pdf locked");
  };

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {    
        if ( onClose ) {
            onClose();
            open = false;
        };
    }

    const doNext = () => {
        if ( pageNumber < numPages)
        setPageNumber(pageNumber + 1);
    }

    const doPrev = () => {
        if ( pageNumber > 1  )
        setPageNumber(pageNumber - 1);
    }
    
  return (
    <React.Fragment>
      <Box sx={{display:'flex', justifyContent: 'flex-end',  p:1, bgColor:'#444' }}>
        
        <ButtonGroup color="inherit" sx={{height:20}} >
            <Button onClick={() => setScale(scale - 0.1)} disabled={scale <= 0.2}> 축소 </Button>
            <Button onClick={() => setScale(1.0)} > 1:1 </Button>
            <Button onClick={() => setScale(scale + 0.1)} disabled={scale >= 2.0}> 확대</Button>
        </ButtonGroup>
        <ButtonGroup color="inherit" sx={{height:20,  ml:2}}>
            <Button onClick={doPrev} >이전</Button>
            <Button onClick={doNext} >다음</Button>
        </ButtonGroup>
        <Box sx={{mx:3}}>Page {pageNumber} of {numPages}</Box>
      </Box>
      <Divider />
      <Box>
        <Document 
          file={docUrl} 
          onLoadSuccess={onDocumentLoadSuccess}      
        >        
          <Page 
            width={900} scale={scale}
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>        
      </Box>
    </React.Fragment>
  );
}