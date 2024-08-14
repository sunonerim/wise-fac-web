import { useState, useEffect } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

export default function RimTreeView( { treeData,  loadItemCallback } ) {
    const [treeItems, setTreeItems] = useState( [] );
    const [reload, setReload] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let folderFileList = await loadItemCallback(null);
                console.log('folderFileList', folderFileList);

                setTreeItems(folderFileList);
            } catch (error) {
                console.error('Error loading items:', error);
            }
        };

        fetchData();
    }, [reload]);


    return (        
            <List dense>
                { treeItems.map( (item) => (
                    <ListItem key={item.id}>
                        <ListItemText primary={item.name} />
                    </ListItem>
                ))}
            </List>        
    );
}