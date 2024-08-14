import React, {useState, useEffect} from 'react';
import {Box, CircularProgress,Backdrop , Typography} from '@mui/material';

export default function ApiRequest( {api} ) {
    const [show, setShow] = useState(false);
    
    useEffect(() => {
        console.log('------------------ ApiRequest useEffect --------------------', api );
        if ( api ){
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 2000);
        }
        
    }
    , [api]);

    const Progess = ({show}) => {
        if ( show ) {
            return (
              <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={show}                            
            >
                <Box sx={{bgcolor:"#444",  width:240, height: 160, borderRadius:2, display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
                    <CircularProgress color="inherit" />
                    <Typography variant="h6" color="#fff" sx={{  mt:3}}>데이터 처리중...</Typography>
                </Box>
            </Backdrop>
            );
        } else {
            return (
                <></>
            );
        }
    }
    return (
        <>            
            <Progess show={show}/>
        </>
    );
}