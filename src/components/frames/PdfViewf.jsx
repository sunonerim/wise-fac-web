import React, { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import Button from '@mui/material/Button';
import { ButtonGroup, Box } from "@mui/material";


const PDFView = ({ path }) => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
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

  return (
    <Box sx={{border:1}}>
    <div>
      <ButtonGroup size="small" variant="outlined"  sx={{height:20, fontSize:9}}>
        <Button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}> 이전 페이지 </Button>
        <Button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === numPages}> 다음 페이지 </Button>
      </ButtonGroup>
    </div>
    <Document 
      file={pdfPath} 
      onLoadSuccess={onDocumentLoadSuccess}      
      >        
      <Page 
      width={900} scale={1.0}
      pageNumber={pageNumber}
      renderTextLayer={false}
      renderAnnotationLayer={false}
       />
    </Document>
    <p>
      Page {pageNumber} of {numPages}
    </p>
  
  </Box>
  );
};

export default PDFView;