import {useState ,useEffect } from 'react';
import {Box,Chip,Typography,IconButton} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import  {DataGridPro}  from '@mui/x-data-grid-pro';

import {CreateNewFolderOutlined }from '@mui/icons-material';
import {FolderFilled, FolderOutlined, FileWordOutlined, FileExcelOutlined,  FilePptOutlined, FilePdfOutlined , FileOutlined} from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// third-party
import { NumericFormat } from 'react-number-format';




function FolderFileTypeExpression ( {metaName, name } ) {
  // console.log('FolderFileTypeExpression', metaName, name);
  const fileIocnStylle = { fontSize: '20px', color: '#888' };
  const folderIocnStylle = { fontSize: '20px', color: '#69b1ff' };

  if (metaName === 'FOLDER') {
    return <FolderFilled style={folderIocnStylle} />;
  } else {
    if( !name ) {
      return <FileOutlined style={ fileIocnStylle }  />
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      return <FileExcelOutlined style={fileIocnStylle} />;
    } else if( name.endsWith('.docx') || name.endsWith('.doc') ) {    
      return <FileWordOutlined style={fileIocnStylle}  />
    } else if( name.endsWith('.pptx') || name.endsWith('.ppt') ) {
      return <FilePptOutlined style={ fileIocnStylle}  />
    } else if( name.endsWith('.pdf') ) {
      return <FilePdfOutlined style={fileIocnStylle}  />
    } else {      
      return <FileOutlined style={ fileIocnStylle }  />
    }
  }
}

function UIFileSize( {metaName, size} ) {
  let sizeText = '';
  if( metaName === 'FOLDER' ) {
    return <Typography variant="caption" color="textSecondary">-</Typography>
  } else {
    let recalcSize = size;
    let sizeSuffix = '';
    if (size > 1024 * 1024 * 1024) {
      sizeSuffix = ' GB';
      recalcSize = Math.round(size / (1024 * 1024 * 1024));
    } else if (size > 1024 * 1024) {
      sizeSuffix = ' MB';
      recalcSize = Math.round(size / (1024 * 1024));
    } else if (size > 1024) {
      sizeSuffix = ' KB';
      recalcSize = Math.round(size / 1024);
    }
    return  <Typography variant="caption" color="textSecondary"><NumericFormat value={recalcSize} displayType="text" thousandSeparator suffix={sizeSuffix} /></Typography>
  }
}

function UIFormatDate({dateStr}) {
  const d = dateStr.substring(0, 10);
  return <Typography variant="caption" color="textSecondary">{d}</Typography>
}


function UIActionCell({ item, onItemActionClick}) {
  const iconStyle = { fontSize: '16px', color: 'secondary.light'};

  // console.log( '--------UIActionCell', item);

  if ( item.metaName === 'FOLDER' ) 
    return (
   <>
      <IconButton aria-label="delete" size="small" onClick={ (e) => onItemActionClick(  'delete', item)} >
        <DeleteIcon sx={iconStyle}/>
      </IconButton>
      <IconButton aria-label="rename"  size="small"  onClick={ (e) => onItemActionClick(  'rename', item)}>
        <EditIcon sx={iconStyle}/>
      </IconButton >
    </>
    );
  else 
    return (
      <>
        <IconButton aria-label="delete" size="small" onClick={ (e) => onItemActionClick(  'delete', item)} >
          <DeleteIcon sx={iconStyle}/>
        </IconButton>
        <IconButton aria-label="rename"  size="small"  onClick={ (e) => onItemActionClick(  'rename', item)}  >
          <EditIcon sx={iconStyle}/>
        </IconButton>        
        <IconButton aria-label="rename"  size="small"  onClick={ (e) => onItemActionClick(  'view', item)}   >
          <VisibilityIcon sx={iconStyle}/>
        </IconButton>
        <IconButton aria-label="rename"  size="small"  onClick={ (e) => onItemActionClick(  'detail', item)}   >
          <CloudDownloadIcon sx={iconStyle}/>
        </IconButton>
        
      </>
    );
}

const conversionStatusColor = {
  'CONVERTING': 'primary',
  'DONE': 'success',
  'ERROR': 'error',
  'READY': 'secondary',
};


function UIFileStatus ( {item}  ) {
  // console.log('UIFileStatus', item);

  if ( item.metaName == 'FOLDER') {
    return <></>
  }

  if( ! item.conversionStatus ) {
    item.conversionStatus = 'ERROR';
  }

  return <Chip label={item.conversionStatus} color={conversionStatusColor[item.conversionStatus]} variant="combined" sx={{borderRadius:12, height:16, fontSize:10}}/>;  
}




// ==============================|| FolderFileGridView ||============================== //
export default function FolderFileGridView({rowData, onItemActionClick, onCheckedChange}) {
  const columns = [
    { field: 'id', headerName: 'ID', 
      width: 24 ,
      renderCell: (params) => {
        return (
          FolderFileTypeExpression ( {metaName:params.row.metaName, name:params.row.name} ) 
        );
      }
    },
    {
      field: 'name',
      headerName: '이름',
      width: 400,
      editable: false,
      renderCell: (params) => {
        return (
          <div>
            {params.row.metaName === 'FOLDER' ? (     
              <span style={{ fontWeight: 'bold' }}>{params.row.name}</span>
            ) : (
              <span>{params.row.name}</span>
            )}
          </div>
        );
      }
      
    },
    {
      field: 'ownerId',
      headerName: '소유자',
      width: 120,
      editable: true,
      renderCell: (params) => {
        return <UIFileStatus item={params.row} />;          
      }
    },
    {
      field: 'size',
      headerName: '크기',
      type: 'number',
      width: 120,
      editable: true,
      renderCell: (params) => {
        return <UIFileSize metaName={params.row.metaName} size={params.row.size} />;
      }
    },
    {
      field: 'createDate',
      headerName: '생성일시',
      // description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      width: 120,
      renderCell: (params) => {
        return <UIFormatDate dateStr={params.row.createDate} />;
      }    
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 320,
      renderCell: (params) => {
        return <UIActionCell item={params.row} onItemActionClick={onItemActionClick}/>;
      }
    }
  ];


  // const [rowData, setRowData] = useState(rows);
  const [loading, setLoading] = useState(true);

  const doCellClick = (params, event, details) => {
    // console.log('doCellClick', params, details);
    if ( params.row.metaName === 'FOLDER' ) {      
      if( params.field === 'name' || params.field === 'id' ) {
        if( onItemActionClick ) {
          onItemActionClick( 'open', params.row );
        }
      }
    }
  };

  const doSelectionModelChange = (params) => {
     console.log('doSelectionModelChange', params);
    if( onCheckedChange ) {
      onCheckedChange( params );
    }
  }

  // useEffect(() => {
  //   console.log('------------------ FolderFileGridView useEffect --------------------');
  //   let rows = [];
  //   for (let i = 0; i < 1000; i += 1) {    
  //     rows.push({
  //       id: i + 1,
  //       lastName: 'Roxie', firstName: 'Harvey', age: i+ 10
  //     });
  //   }

  //   setRowData(rows);
  // }, [loading]);

  return (
    <Box sx={{ height:500, width: '100%' }}>      
      <DataGrid
        rowHeight={32}
        rows={rowData}
        columns={columns}        
        checkboxSelection        
        disableRowSelectionOnClick
        onCellClick={doCellClick}
        onRowSelectionModelChange={doSelectionModelChange}
        sx={{          
          border: 1,
          borderColor: 'secondary.light', 
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
      
    </Box>
  );
}