import {useState, useEffect}  from 'react';
// material-ui

import {Box, Button, Grid, IconButton, InputBase, Menu, MenuItem, Breadcrumbs, Link,
  ListSubheader, List,ListItemButton, ListItemIcon, ListItemText, Collapse, ListItem,SvgIcon,
  Divider,  Typography, ButtonGroup, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tableCellClasses } from '@mui/material';

import axios from 'axios';


import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StarIcon from '@mui/icons-material/Star';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';


// project import
import MainCard from 'components/MainCard';
import FileUploadDialog from 'components/dialogs/FileUploadDialog';
import FolderEditDialog from 'components/dialogs/FolderEditDialog';
import FolderFileListView from 'components/frames/FolderFileListView';
import FileDetailDrawer from 'components/drawers/FileDetailDrawer';
import FolderSelectDialog from 'components/dialogs/FolderSelectDialog';
import DriveRequest from 'api/driveRequest.jsx';
import ApiRequest from 'components/logic/ApiRequest';

// ==============================|| SAMPLE PAGE ||============================== //


function NewSpeedDial () {
  const actions = [
    { icon: <FileCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

  return ( 
  <Box sx={{ height: 100, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
    </SpeedDial>
  </Box>
  );
}

// function postFileUpload( files ) {
//   console.log('---------- handleFileUpload', files);
//   const formData = new FormData();  
//   files.forEach( file => {
//     formData.append('multipartFiles', file);
//   });
//   formData.append('parentId', curFolderId );
//   formData.append('aclId', 200 );
  
//   fetch('http://localhost:8080/wisemen/api/v1/mydrive/folders/files', {
//     method: 'POST',
//     body: formData,
//     headers: { 'wm-user-id': 'tiger'}
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log("data", data);
//     })
//     .catch( error => {
//       console.log( 'ERROR FETCH ')
//     });
// }

// ==============================|| MyDrive ||============================== //
export default function MyDrive() {
  // const [menuList, setMenuList] = useState([]);
  const [folderSelectOpen, setFolderSelectOpen] = useState(false);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [folderPath, setFolderPath] = useState([]);
  const [folderContents, setFolderContents] = useState([]);         // 퐁더의 자식 파일 목록
  const [uploadOpenDialog, setUploadOpenDialog] = useState(false);
  const [folderCreateOpenDialog, setFolderCreateOpenDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fileSelectMode, setFileSelectMode] = useState(null);
  const [reload, setReload] = useState(0);
  const [api, setApi] = useState(null);

  
  const [curFolderId, setCurFolderId] = useState(1);
  useEffect(()=>
    {      
      goFolder(curFolderId);
    }, [reload]);

  const handleOpenUpload = (event) => {
    // console.log('파일 업로드 클릭');
    setUploadOpenDialog(true);
  };

  const handleFileUpload = (files) => {
    console.log('파일 업로드', files);
    if ( files && files.length > 0 ){
      DriveRequest.postFileUploadCommand( curFolderId, files ).then( (response) => { 
        // console.log('response', response);
        refreshList();
      });
    }
    
    setUploadOpenDialog(false);
  };

  const handleFolderCreate = () => {
    openFolderCreateOpenDialog();
  };

  const handleFolderCreateClose = (folderName) => {
    // console.log('폴더 생성', folderName);
    closeFolderCreateOpenDialog();
    DriveRequest.postFolderCreateCommand(curFolderId,  folderName).then( (response) => {
      // console.log('response', response);
      refreshList();
    });
  };

  const openFolderCreateOpenDialog = () => {
    setFolderCreateOpenDialog(true);
  };

  const closeFolderCreateOpenDialog = () => {
    setFolderCreateOpenDialog(false);
  };



  const openFileDrawer = () => {
    setFileDrawerOpen ( true )
  };

  const closeFileDrawer = () => {
    setFileDrawerOpen ( false )
  };


  const refreshList = () => {
    setReload(reload + 1);
  };


  const handleDuplicate = (event) => {    
    
    if( selectedItems.length > 0 ) {
      openFolderSelectDialog ('DUPLICATE' );
    } else {    
      setApi ( Date.now() );
      // alert('복제할 파일을 선택하세요');
    }
  }

  const handleMove = (event) => {
    console.log( '---- handleMove', selectedItems );    
    if( selectedItems.length > 0 ) {
      openFolderSelectDialog ( 'MOVE');
    } else {
      alert('이동할 파일을 선택하세요');
    }
  }
  const openFolderSelectDialog = (selectMode ) => {
    setFileSelectMode( selectMode );
    setFolderSelectOpen(true);
  };

  const closeFolderSelectDialog = (folderId) => {
    if( folderId ) {
      if( fileSelectMode === 'MOVE' ) {
        console.log('MOVE   selectedItems -->  folderId', folderId, selectedItems );
        setApi ( 'http://localhost:8080/wisemen/api/v1/mydrive/folders/move' );
        goFolder(folderId);
      } else if ( fileSelectMode === 'DUPLICATE' ) {
        console.log('복제    selectedItems -->  folderId', folderId, selectedItems );
        setApi ( 'http://localhost:8080/wisemen/api/v1/mydrive/folders/DUPLICATE' );
        goFolder(folderId);
      }      
    }
    setFolderSelectOpen(false);
  };

  const setupFolderContents = ( contents  ) => {
    contents.forEach( content => {
      content.checked = true;
    });
      // console.log ('setupFolderContents', contents);
      setFolderContents(contents);
  }

  const getFolderContentQuery = ( folderId ) => {
    DriveRequest.getFolderContents( folderId ).then( (contents) => {
      setupFolderContents(contents);
    });
  };

  const getFolderPath = ( folderId ) => {
    DriveRequest.getFolderPath( folderId ).then ( (path) => {
      setFolderPath(path);
    });
  }

  const goFolder = ( folderId ) => {
    setCurFolderId( folderId );
    DriveRequest.getFolderContents( folderId ).then( (contents) => {
      // console.log('eee folderContents', contents);
      setFolderContents(contents);
      setSelectedItems([]);
    });
    getFolderPath( folderId );
  }

  const handleFolder = ( folderId ) => {
    return (event) => {
      goFolder( folderId );
    };
  }

  const doCheckedChange = (selected) => {
    console.log('onCheckedChange', selected);
    setSelectedItems(selected);
  }

const doItemActionClick = (  command, folder ) => {
  switch( command ) {
    case 'open':
      if( folder.metaName === 'FOLDER' ) {
        goFolder( folder.id );
      }
      break;

  case 'delete':
      console.log('delete', folder);
      if (folder.metaName === 'FOLDER') {
        DriveRequest.deleteFolderCommand( folder.id ).then( (response) => {
          console.log('response', response);
          refreshList();
        });        
      } else {
        DriveRequest.deleteFileCommand( folder.id ).then( (response) => {
          console.log('response', response);
          refreshList();
        });
      }
      break;

  case 'rename':
      console.log('rename', folder);      
      break;

  case 'download':
      console.log('download', folder);
      break;
    
  case 'view':
      console.log('view', folder);
      openFileDrawer();
      break;
  }
};


  function Breadcombpath ( {paths} ) {          
    console.log('Breadcombpath', paths);
    return (
      <Breadcrumbs aria-label="breadcrumb">
        { paths.map( (path, index) => (
          index === paths.length - 1 ? (
            <Typography key={path.id} color="text.primary" >{path.name}</Typography>
          ) : (            
            <Typography key={path.id} color="text.primary" onClick={handleFolder(path.id)} sx={{cursor:"pointer", "&:hover": { color: "#0958d9" } }} >{path.name}</Typography>
          )
        ))}
      </Breadcrumbs>
    );
  }
  return (
    <>
    <MainCard title="My Drive">
      <ApiRequest api={api}/>
      <Breadcombpath paths={folderPath} />    

      <FileDetailDrawer open={fileDrawerOpen} onClose={ closeFileDrawer } />

      <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>       
         <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
          <Button onClick={handleFolderCreate} sx={{width:120}} >폴더 생성</Button>
          <Button onClick={handleOpenUpload}   sx={{width:120}}>파일업로드</Button>
          <Button onClick={handleDuplicate}    sx={{width:120}}>복제</Button>
          <Button onClick={handleMove}         sx={{width:120}}>이동</Button>
         </ButtonGroup>
      </Box>      
      <FolderFileListView folderContents={folderContents} onItemActionClick={doItemActionClick} onCheckedChange={doCheckedChange} />
      <NewSpeedDial/>

      <FileUploadDialog fileUploadCallback={handleFileUpload} open={uploadOpenDialog} />
      <FolderEditDialog open={folderCreateOpenDialog} onClose={handleFolderCreateClose} />
      <FolderSelectDialog open={folderSelectOpen} onClose={closeFolderSelectDialog} rootFolderId={1} />
    </MainCard>
    
    </>
  );
}