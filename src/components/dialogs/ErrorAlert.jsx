import React, {useState, useEffect} from 'react';
import {Alert, AlertTitle, Box, Backdrop,  IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function ErrorAlert({  message , time }) {
    const [open, setOpen] = useState(false);
    

    var errorMessage = message? message : '오류 입니다.';

    useEffect(() => {        
        if (message) {
            setOpen(true);
        }
    },[time,message]);
    

    return (
        <Backdrop
            invisible={false}
             sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
            <Box sx={{ width: '40%' }}>
                <Alert
                variant="filled" 
                severity="error" 
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                        setOpen(false);
                    }}
                    >
                    <CloseIcon fontSize="inherit" />
                    </IconButton>
                    }
                sx={{ mb: 2 }}
                >
                <AlertTitle>오류 알림</AlertTitle>
                {errorMessage}     
                </Alert>
            </Box>
        </Backdrop>
    );
}