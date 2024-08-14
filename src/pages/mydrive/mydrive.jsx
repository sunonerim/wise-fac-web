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
import FileUploadDialog from 'pages/mydrive/FileUploadDialog';
import FolderEditDialog from 'components/dialogs/FolderEditDialog';
import FolderFileListView from 'components/frames/FolderFileListView';
import FileDetailDrawer from 'components/drawers/FileDetailDrawer';
import FolderSelectDialog from 'components/dialogs/FolderSelectDialog';

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

function postFileUpload( files ) {
  console.log('---------- handleFileUpload', files);
  const formData = new FormData();  
  files.forEach( file => {
    formData.append('multipartFiles', file);
  });
  
  formData.append('parentId', 1 );
  formData.append('aclId', 200 );
  
  fetch('http://localhost:8080/wisemen/api/v1/mydrive/folders/files', {
    method: 'POST',
    body: formData,
    headers: { 'wm-user-id': 'tiger'}
  })
    .then(response => response.json())
    .then(data => {
      console.log("data", data);
    })
    .catch( error => {
      console.log( 'ERROR FETCH ')
    });

}

// ==============================|| MyDrive ||============================== //
export default function MyDrive() {
  // const [menuList, setMenuList] = useState([]);
  const [folderSelectOpen, setFolderSelectOpen] = useState(false);
  const [fileDrawerOpen, setFileDrawerOpen] = useState(false);
  const [folderPath, setFolderPath] = useState([]);
  const [folderContents, setFolderContents] = useState([]);         // 퐁더의 자식 파일 목록
  const [uploadOpenDialog, setUploadOpenDialog] = useState(false);
  const [folderCreateOpenDialog, setFolderCreateOpenDialog] = useState(false);
  const leftMenuWidth = 250;
  const [reload, setReload] = useState(0);
  
  useEffect(() => {
    console.log('------------------ MyDrive useEffect --------------------');
    goFolder(1);    
  }, [reload]);

  const handleOpenUpload = (event) => {
    console.log('파일 업로드 클릭');
    setUploadOpenDialog(true);
  };

  const handleFileUpload = (files) => {
    console.log('파일 업로드', files);
    postFileUpload(files);
    setUploadOpenDialog(false);
  };

  const handleFolderCreate = (event) => {
    setFolderCreateOpenDialog(true);
  };

  const handleFolderCreateClose = (folderName) => {
    console.log('폴더 생성', folderName);
    setFolderCreateOpenDialog(false);
    postFolderCreateCommand(folderName);
  };

  const handleFolderSelectClose = (fileLists) => {
    setFolderSelectOpen(false);
  };

  const refreshList = () => {
    setReload(reload + 1);
  };


  const handleDuplicate = (event) => {
    folderContents.filter( content => content.checked === true ).forEach( content => {      
      console.log('duplicate', content);
    });
    setFolderSelectOpen ( true );
  }

  const handleMove = (event) => {
    folderContents.filter( content => content.checked === true ).forEach( content => {
      console.log('duplicate', content);
    });
  }

  const setupFolderContents = ( contents  ) => {
      contents.forEach( content => {
        content.checked = true;        
      });
      console.log ('setupFolderContents', contents);
      setFolderContents(contents);
  }

  const getFolderContentQuery = ( folderId ) => {
    let urlFolderContentQuery = `http://localhost:8080/wisemen/api/v1/mydrive/folders/${folderId}`;
    axios.get( urlFolderContentQuery, { 
      headers:{        
       'wm-user-id': 'tiger'
         } 
       } ).then ( response => {
        console.log('response', response);        
        setupFolderContents(response.data);
    });
  };

  const getFolderPath = ( folderId ) => {
    let urlFolderContentQuery = `http://localhost:8080/wisemen/api/v1/mydrive/folders/path/${folderId}`;
    axios.get( urlFolderContentQuery
              , { headers:{    'wm-user-id': 'tiger'} })
          .then ( response => {
            console.log('PATH', response);            
            setFolderPath(response.data.reverse());
        });
    }

  const goFolder = ( folderId ) => {
    console.log('goFolder', folderId);
    getFolderContentQuery( folderId );
    getFolderPath( folderId );
  }

  const handleFolder = ( folderId ) => {
    return (event) => {
      goFolder( folderId );
    };
  }

  const postFolderCreateCommand = ( folderName ) => {
    axios.post('http://localhost:8080/wisemen/api/v1/mydrive/folders', 
      {
      folderName: folderName,
      parentId: 1,
      aclId: 200
      }, 
      { 
      headers:{ 
       'Content-type': 'application/json', 
       'Accept': 'application/json' ,
       'wm-user-id': 'tiger'} 
       } ).then ( response => {
        console.log('response', response);
      // setReload(reload + 1);
        refreshList();
    });
  };

  const requestFileDelete = ( fileId ) => {
    axios.delete(`http://localhost:8080/wisemen/api/v1/mydrive/folders/files/${fileId}`
      ,{headers:{ 
       'Content-type': 'application/json', 
       'Accept': 'application/json' ,
       'wm-user-id': 'tiger'
         } 
        }
        ).then ( response => {
        console.log('response', response);       
        refreshList();
    });
  };

  const folderClickHandle = (  command, folder ) => {
    switch( command ) {
      case 'open':
        if( folder.metaName === 'FOLDER' ) {
          goFolder( folder.id );
        }
        break;

      case 'delete':
        console.log('delete', folder);
        if (folder.metaName === 'FOLDER') {
        } else {
          requestFileDelete( folder.id );
        }
        break;

      case 'rename':
        console.log('rename', folder);
        setFileDrawerOpen(true);
        break;

      case 'download':
        console.log('download', folder);
        break;
    }
  };

  const handleFileDrawerClose = () => {
    setFileDrawerOpen ( false)
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
      <Breadcombpath paths={folderPath} />    

      <FileDetailDrawer open={fileDrawerOpen} onClose={ handleFileDrawerClose } />

      <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>       
         <ButtonGroup variant="outlined" aria-label="Basic button group" size="small">
          <Button onClick={handleFolderCreate} sx={{width:120}} >폴더 생성</Button>
          <Button onClick={handleOpenUpload}   sx={{width:120}}>파일업로드</Button>
          <Button onClick={handleDuplicate}    sx={{width:120}}>복제</Button>
          <Button onClick={handleMove}         sx={{width:120}} startIcon={<UploadFileOutlinedIcon/>}>이동</Button>
         </ButtonGroup>
      </Box>      
      <FolderFileListView folderContents={folderContents} onFolderClick={folderClickHandle} onCheckedChange={ (selected)=>{ console.log( selected )}} />
      <NewSpeedDial/>

      <FileUploadDialog fileUploadCallback={handleFileUpload} open={uploadOpenDialog} />
      <FolderEditDialog open={folderCreateOpenDialog} onClose={handleFolderCreateClose} />
      <FolderSelectDialog open={folderSelectOpen} onClose={handleFolderSelectClose} rootFolderId={1}/>
    </MainCard>
    
    </>
  );
}