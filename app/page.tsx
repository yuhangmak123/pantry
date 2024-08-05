"use client"

import { Box, Button, Modal, Stack, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import { text } from "stream/consumers";
import db from "../firebase"
import { collection, addDoc, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const SearchBar = ({ setSearchQuery, searchQuery }: { setSearchQuery: any, searchQuery: string }) => (
  <TextField
    id="search-bar"
    className="text"
    style={{ width: 800 }}
    onInput={(e) => {
      setSearchQuery((e.target as HTMLInputElement).value);
    }}
    variant="outlined"
    size="small"
    InputProps={{
      style: { borderRadius: "20px" },
      endAdornment: (
        <InputAdornment position="end">
          <IconButton aria-label="search" edge="end">
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

const filterData = (query: string, data: any[]) => {
  if (!query) {
    return data;
  } else {
    return data.filter(({ name, quantity }) => name.toLowerCase().includes(query.toLowerCase()));
  }
};


export default function Home() {
  const [inventory, setInventory] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, inventory);
  const inventoryCollection = collection(db, 'inventory')

  const updateInventory = async () => {
    const snapshot = query(inventoryCollection)
    const docs = await getDocs(snapshot)
    const inventoryList: { name: string; }[] = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const addItem = async (item: string | undefined) => {
    const docRef = doc(inventoryCollection, item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item: string | undefined) => {
    const docRef = doc(inventoryCollection, item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {dataFiltered.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
