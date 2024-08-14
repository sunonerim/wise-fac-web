import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, styled, Box , Typography} from '@mui/material';
import { CloudUpload} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import {useDropzone} from 'react-dropzone';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },    
  }));

  
// ==============================|| FileUploadDialog  ENTRY POINT  ||============================== //  
function FileUploadDialog({ fileUploadCallback, open }) {
    // const [open, setOpen] = useState(fromParentOpen);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

    
    const handleClose = () => {
        if(acceptedFiles ) acceptedFiles.splice(0, acceptedFiles.length);
        open = false;
    };

    const handleFileUpload = (event) => {
        // setOpen(false);
        let currentTimestamp = new Date().getTime();
        console.log('File uploaded',currentTimestamp  );
        if( fileUploadCallback ) {
            fileUploadCallback(acceptedFiles);
        }
    };

    const files = acceptedFiles.map(file => (
        <Box key={file.path} sx={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', borderBottom:1, borderColor:'#EEE' , mt:0.5}}>
            <Typography variant='main'>{file.path}</Typography>
            <Typography variant='caption'>{file.size}</Typography>            
        </Box>      
        )
    );

    function FileItems(){
      if ( acceptedFiles.length == 0 ) 
        return ;
      else 
      return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>                        
                  <Typography variant='subtitle1' sx={{mt:2}}>파일 목록</Typography>
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    { acceptedFiles.map ( file => ( 
                    <Box  key={file.path} sx={{display: 'flex', flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', borderBottom:1, borderColor:'#EEE' , mt:0.5}}>
                      <Typography variant='main'>{file.path}</Typography>
                      <Typography variant='caption'>{file.size}</Typography>            
                    </Box>      
                    )
                  )
                  }                    
                  </Box>                                              
            </Box>      
      );
    }

    return (
        <>        
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }}>파일 업로드</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
        <CloseIcon />
        </IconButton>
        
        <DialogContent dividers>
        <section className="container">
            <Box {...getRootProps({className: 'dropzone'})}  sx={{border: '1px dashed grey',borderRadius:2,  p:1,  width:640 }}>
            <input {...getInputProps()}  />
                <Box sx={{textAlign: 'center'}}>
                <CloudUpload sx={{fontSize: 64,  fill: "#AAA"}} />
                <Typography variant="h4" color="secondary">업로드할 파일을 여기에 넣어주시기 바랍니다.</Typography>
                </Box>
            </Box>
            <FileItems />
        </section>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleFileUpload} startIcon={<CloudUpload />}>
            Upload Files...
          </Button>
        </DialogActions>
      </BootstrapDialog>
        </>
    );
}

export default FileUploadDialog;