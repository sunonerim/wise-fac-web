import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box , TextField} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined';
import RimTreeView from 'components/frames/RimTreeView';
import FolderTreeView from 'components/frames/FolderTreeView';

import axios from 'axios';


// ==============================|| FileUploadDialog  ENTRY POINT  ||============================== //
export default function FolderSelectDialog({  open, onClose , rootFolderId }) {
  const [folderName, setFolderName] = useState('');
  const [folderList, setFolderList] = useState([]);

  useEffect(() => {
    getFolderContentQuery(rootFolderId);
  }, [folderName]);

  const getFolderContentQuery = async ( folderId ) => {
    console.log('---- getFolderContentQuery', folderId);
    
    let urlFolderContentQuery = `http://localhost:8080/wisemen/api/v1/mydrive/folders/${rootFolderId}`;
    if( folderId )
      urlFolderContentQuery =  `http://localhost:8080/wisemen/api/v1/mydrive/folders/${folderId}`
    

    let folderFileList =await axios.get(urlFolderContentQuery, { headers: { 'wm-user-id': 'tiger' } });
    return folderFileList.data.filter( content => content.metaName === 'FOLDER' );    
  };


  const createTreeItem = ( folder ) => {
    return {
      id: ''+folder.id,
      label: folder.name,
      children: []
    };
  }

  const setupFolderContents = ( contents  ) => {    
    setFolderList ( contents.filter( content => content.metaName === 'FOLDER' ).map( folder => createTreeItem(folder) ) );    
    console.log ('folderList', folderList);
  }

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


  

  const doSelectCallback = (folderId) => {
    console.log('-------doSelectCallback', folderId);    
  }

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
                <RuleFolderOutlinedIcon  sx={{fontSize:54, fill:"#97a3b9" }} />
                <Box sx={{display: 'flex', flexDirection: 'column', alignContent: 'space-between', ml:2}}>
                    <Typography variant='h5'>폴더 선택</Typography>
                    <Typography variant='caption' color="textSecondary">폴더를 선택합니다</Typography>
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

        <DialogContent dividers sx={{maxHeight:320, height:320}}>                  
          <FolderTreeView loadItemCallback={getFolderContentQuery} onSelectCallback={doSelectCallback}/>
        </DialogContent>
            
        <DialogActions>
         <Button onClick={handleFolderCreateClose} variant="outlined" size="small">취소</Button>
         <Button onClick={onCreate}  variant="contained" size="small">선택</Button>
        </DialogActions>
      </Dialog>
        </>
    );
}