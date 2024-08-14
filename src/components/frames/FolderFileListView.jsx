import {useState ,useEffect } from 'react';

import PropTypes from 'prop-types';
// material-ui

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Checkbox, IconButton} from '@mui/material';

// third-party
import { NumericFormat } from 'react-number-format';


// icon 
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { FileWordOutlined, FileExcelOutlined,  FilePptOutlined, FilePdfOutlined , FileOutlined} from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';


function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}


function createDataList ( array ) {
  let rows = [];
  array.forEach( (item, index) => {    
    rows.push( Object.assign( item, { checked: false }) );
  });
  return rows;
}



// ==============================|| ORDER TABLE - HEADER ||============================== //
function FolderFileTypeExpression ( {metaName, name } ) {
  if (metaName === 'FOLDER') {
    return <CreateNewFolderOutlinedIcon sx={{ fill: 'blue', fontSize: 24, mb:-1 }} />;
  } else {
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      return <FileExcelOutlined style={{ fontSize: '20px', fill: '#DDD' }} />;
    } else if( name.endsWith('.docx') || name.endsWith('.doc') ) {    
      return <FileWordOutlined style={{ fontSize: '20px', fill: '#DDD' }}  />
    } else if( name.endsWith('.pptx') || name.endsWith('.ppt') ) {
      return <FilePptOutlined style={{ fontSize: '20px', fill: '#DDD' }}  />
    } else if( name.endsWith('.pdf') ) {
      return <FilePdfOutlined style={{ fontSize: '20px', fill: '#DDD' }}  />
    } else {      
      return <FileOutlined style={{ fontSize: '20px', fill: '#DDD' }}  />
    }
  }
}


function FileSizeFormat( {metaName, size} ) {
  let sizeText = '';
  if( metaName === 'FOLDER' ) {
    return <Typography variant="caption" color="textSecondary">-</Typography>
  } else {
    let recalcSize = size;
    let sizeSuffix = '';
    if (size > 1024 * 1024 * 1024) {
      sizeSuffix = 'GB';
      recalcSize = Math.round(size / (1024 * 1024 * 1024));
    } else if (size > 1024 * 1024) {
      sizeSuffix = 'MB';
      recalcSize = Math.round(size / (1024 * 1024));
    } else if (size > 1024) {
      sizeSuffix = 'KB';
      recalcSize = Math.round(size / 1024);
    }
    return  <Typography variant="caption" color="textSecondary"><NumericFormat value={recalcSize} displayType="text" thousandSeparator suffix={sizeSuffix} /></Typography>
  }
}

function FormatDate({dateStr}) {
  const d = dateStr.substring(0, 10);
  return <Typography variant="caption" color="textSecondary">{d}</Typography>
}

function handleFileUpload( files ) {
  console.log('---------- handleFileUpload', files);
  const formData = new FormData();  
  files.forEach( file => {
    formData.append('multipartFiles', file);
  });
  
  formData.append('parentId', 220 );
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

// ==============================|| FOLDER FILE LIST VIEW  TABLE ||============================== //
export default function FolderFileListView( {folderContents, onFolderClick, onCheckedChange} ) {
  // const [folderContents, setFolderContents] = useState([]);
  const order = 'asc';
  const orderBy = 'tracking_no';
  const [selected, setSelected] = useState([]);
  const [rowData, setRowData] = useState([]);
  

const headCells = [  
  {
    id: 'name',
    align: 'center',
    disablePadding: true,
    label: '이름'    
    ,width: 'auto'
  },
  {
    id: 'fileType',
    align: 'center',
    disablePadding: false,
    label: '종류'
    ,width: 120
  },
  {
    id: 'size',
    align: 'center',
    disablePadding: false,
    label: '크기'
    ,width: 120
  },
  {
    id: 'createDate',
    align: 'center',
    disablePadding: false,
    label: '작성일자'
    ,width: 120
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: false,
    label: ''
    ,width: 120
  }
];


  useEffect(() => {
    console.log('------------------ FolderFileListView useEffect --------------------');
    // getFolderContentQuery( 1 );
    setRowData ( createDataList(folderContents) );

  }, [folderContents]);

  function HeaderCell({cell}) {
    if( cell.id === 'tracking_no' ) {      
     return  (
      <Checkbox/>      
      );
    } else {
      return <Typography variant="caption" color="textSecondary">{cell.label}</Typography>
    }
  }
  function OrderTableHead({ order, orderBy }) {
    return (
      <TableHead>
        <TableRow>                  
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              padding='checkbox'
              align={headCell.align}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              onClick={(e) => handleHeaderClick( headCell.id ) } 
              sx={{width:headCell.width}}
            >
              <HeaderCell cell={headCell} />
            </TableCell >
          ))}
        </TableRow>
      </TableHead>
    );
  }

  // const isCheckboxChecked = (id) => {
  //   console.log('isCheckboxChecked', id);
  //   return selected.includes(id);
  //   // return false;
  // }

  const handleHeaderClick = (id) => {
    
    let checkedCnt =  rowData.filter( (row) => row.checked ).length;

    if( checkedCnt == 0 ) {
      for (const item of rowData) {
        item.checked = true;
      }
      setRowData([...rowData]);
    } else if ( checkedCnt > 0  ) {
      for (const item of rowData) {
        item.checked = false;
      }
      setRowData([...rowData]);
    }
  }

  const handleChange = ( item, checked ) => {
    for (const row of rowData) {
      if( row.id  == item.id ) {
        row.checked = checked;
      }
    }
    setRowData([...rowData]);

    // console.log('handleChange', row, checked);
    // if(checked) {
    //   selected.push(row.id);
    //   onCheckedChange( selected );
    // } else {
    //   let filtered =selected.filter((id) => id !== row.id);
    //   console.log({ filtered });
    //   setSelected([...filtered]);
    //   onCheckedChange( filtered );
    // }
    
    // console.log({ selected , onCheckedChange});
    // if( onCheckedChange ) {
    //   console.log('------------ onCheckedChange', selected);
    //   onCheckedChange( selected );
    // }
  }
  
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle"  size="small" >
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            { 
            rowData.map((row, index) => {
            // createDataList(folderContents).map((row, index) => {
            // stableSort(folderContents, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row.id}>
                  <TableCell >
                    <Checkbox  onChange={ (e) => handleChange(  row, e.target.checked  )}  checked={ row.checked }/>
                    <FolderFileTypeExpression metaName={row.metaName} name={row.name} />
                    <Typography variant="main" color="textSecondary" sx={{ml:1, '&:hover': { color: 'primary.main' } , cursor:'pointer'}}
                      onClick={ (e) => onFolderClick(  'open', row)}>{row.name}</Typography>
                  </TableCell>
                  
                  <TableCell align="center" ></TableCell>
                  
                  <TableCell align="right" >
                    <FileSizeFormat metaName={row.metaName} size={row.size} />
                  </TableCell >

                  

                  <TableCell align="center" >
                    <FormatDate dateStr={row.createDate} />
                  </TableCell>

                  <TableCell component="th" id={labelId} scope="row">                    
                    <IconButton aria-label="delete" size="small" onClick={ (e) => onFolderClick(  'delete', row)} >
                      <DeleteIcon sx={{height:20, fill:'#BBB'}}/>
                    </IconButton>

                    <IconButton aria-label="rename"  size="small"  onClick={ (e) => onFolderClick(  'rename', row)} >
                      <EditIcon sx={{height:20, fill:'#BBB'}}/>
                    </IconButton>
                    
                    <IconButton aria-label="rename"  size="small"  onClick={ (e) => onFolderClick(  'rename', row)} >
                      <VisibilityIcon sx={{height:20, fill:'#BBB'}}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };