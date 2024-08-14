import * as React from 'react';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { find } from 'lodash';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const CustomTreeItem = styled(TreeItem)({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
});


// ==============================|| FOLDER TREE LIST ||============================== //
export default function FolderTreeView({loadItemCallback, onSelectCallback}) {
    const [treeItems, setTreeItems] = React.useState( [] );
    const [expandedItems, setExpandedItems] = React.useState([]);
    const [reload, setReload] = React.useState(0);
    const [selectItemId, setSelectItemId] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
          console.log('FolderTreeView useEffect');
            try {
                let folderFileList = await loadItemCallback(null);
                folderFileList = folderFileList.map( (item) => {
                    return {
                        id: ''+ item.id, // cast to string
                        label: item.name,
                        loading : false, 
                        children: []
                    };
                });
                console.log('folderFileList', folderFileList);

                setTreeItems(folderFileList);
            } catch (error) {
                console.error('Error loading items:', error);
            }
        };
        fetchData();
    }, [reload]);


    const fetchData = async ( id ) => {
      console.log('FolderTreeView useEffect');
        try {
            let folderFileList = await loadItemCallback(id);
            folderFileList = folderFileList.map( (item) => {
                return {
                    id: ''+ item.id, // cast to string
                    label: item.name,
                    loading : false,    //for lazy loading
                    children: []
                };
            });
            console.log('folderFileList', folderFileList);            
            setupFolderTree(id, folderFileList);
        } catch (error) {
            console.error('Error loading items:', error);
        }
    };

    const setupFolderTree = ( parent_id, contents  ) => {
      let clickedTreeItem = findTreeitem(parent_id);
      console.log('treeItem', clickedTreeItem);
      clickedTreeItem.loading = true;
      clickedTreeItem.children = contents;    
      setTreeItems([...treeItems]);

      if( !expandedItems.includes(parent_id))
        setExpandedItems([...expandedItems, parent_id]);
    }

    const findTreeitem = ( id ) => {
        for (const item of treeItems) {
          if( item.id === id )
            return item;
          let result =  findTreeitemRecursive(item.children, id);
          if( result )
            return result;                    
        }        
        return null;
    }
    const findTreeitemRecursive = ( items, id ) => {
      if( !items || items.length === 0 ) return null;
        for (const item of items) {
            if( item.id === id )
                return item;
            let result = findTreeitemRecursive(item.children, id);
            if( result )
                return result;
        }
        return null;
    }
    
    const closeIfNeed = ( itemId ) => {
      console.log ('closeIfNeed', itemId, expandedItems);
      if( expandedItems.includes(itemId)) {
        let ttt = expandedItems.filter( item => item !== itemId);
        console.log ('closeIfNeed    CaSE 1', itemId, ttt );
        setExpandedItems(ttt);
        console.log ('closeIfNeed    CaSE 1', itemId, expandedItems, ttt);
      } else {
        setExpandedItems([...expandedItems, itemId]);
        console.log ('closeIfNeed    CaSE 2', itemId, expandedItems);
      }
    }

    const doRichTreeViewClick = (event, itemId, isExpanded) => {
      console.clear();
      console.log('doRichTreeViewClick', itemId, isExpanded, treeItems );      
      setSelectItemId(itemId);
      if( onSelectCallback) onSelectCallback( itemId );
      let clickedTreeItem = findTreeitem(itemId);
      if( clickedTreeItem.loading ){
        // setTimeout ( ()=> closeIfNeed( itemId ), 10);
        closeIfNeed( itemId );
      } else {}
        fetchData(itemId);      
      };
  return (
    <Box >      
      <RichTreeView
        defaultExpandedItems={['grid']}
        items={treeItems}
        expandedItems={expandedItems}
        onItemClick={ doRichTreeViewClick }
        slots={{
          expandIcon: FolderOutlinedIcon,
          collapseIcon: IndeterminateCheckBoxIcon,
          endIcon: FolderOutlinedIcon,
          item: CustomTreeItem,
        }}        
        sx={{ minHeight: 360, minWidth: 250 }}
      />
    </Box>
  );
}