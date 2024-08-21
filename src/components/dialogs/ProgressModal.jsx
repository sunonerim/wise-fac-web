import React from 'react';
import { Box,  CircularProgress,Backdrop , Typography} from '@mui/material';




export default function ProgessModal ({show, message}) {    
    let msg = message ? message : '데이터 처리중...';
  if ( show ) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={show}>
        <Box
          sx={{
            bgcolor: '#444',
            width: 240,
            height: 160,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" color="#fff" sx={{ mt: 3 }}>
            {msg}
          </Typography>
        </Box>
      </Backdrop>
    );
  } else {
    return <></>;
  }
}