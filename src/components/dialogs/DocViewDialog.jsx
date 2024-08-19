import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Document, Page } from "react-pdf";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//======================= DocViewDialog =======================
export default function DocViewDialog({open, docName, docUrl, onClose}) {
    //   const [open, setOpen] = React.useState(false);
    const [numPages, setNumPages] = React.useState(1);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [scale, setScale] = React.useState(1.0);

    // const pdfPath = 'http://localhost:8080/wisemen/api/v1/pdf/view'; 
    const pdfPath = 'http://localhost:3000/free/src/assets/docs/govGuide.pdf'; //"assets/docs/demo.pdf";

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
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{docName}</Typography>

            <ButtonGroup color="inherit" sx={{height:20}} >
                
                <Button onClick={() => setScale(scale - 0.1)} disabled={scale <= 0.2}> 축소 </Button>
                <Button onClick={() => setScale(1.0)} > 1:1 </Button>
                <Button onClick={() => setScale(scale + 0.1)} disabled={scale >= 2.0}> 확대</Button>
            </ButtonGroup>

            <ButtonGroup color="inherit" sx={{height:20,  ml:2}} >
                <Button onClick={doPrev} >이전</Button>
                <Button onClick={doNext} >다음</Button>
                
            </ButtonGroup>

          </Toolbar>
        </AppBar>        
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
    <p>
      Page {pageNumber} of {numPages}
    </p>
      </Dialog>
    </React.Fragment>
  );
}