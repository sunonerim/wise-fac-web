import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box , TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';


// ==============================|| FileUploadDialog  ENTRY POINT  ||============================== //
export default function ErrorDialog( {open}) {
  const [folderName, setFolderName] = useState('');
  const onCreate = () => {
    onClose(folderName);
    setFolderName('');
  };
  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleFolderCreateClose = () => {
    onClose ( '') ;
  };
  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        onClose={onClose}
        open={open}
            >
        <DialogTitle sx={{ m: 0, px: 4 , fontSize:16, fontWeight:700}}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>               
                <CreateNewFolderOutlinedIcon sx={{fontSize:54, fill:"#97a3b9" }} />
                <Box sx={{display: 'flex', flexDirection: 'column', alignContent: 'space-between', ml:2}}>
                    <Typography variant='h5'>폴더 생성</Typography>
                    <Typography variant='caption' color="textSecondary">새로운 폴더를 생성합니다</Typography>
                </Box>
            </Box>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
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
            <Typography variant='main'> ERROR </Typography>
        </DialogContent>
            
        <DialogActions>
         <Button onClick={handleFolderCreateClose} variant="outlined" size="small">취소</Button>
         <Button onClick={onCreate}  variant="contained" size="small">생성</Button>
        </DialogActions>
      </Dialog>
        </>
    );
}