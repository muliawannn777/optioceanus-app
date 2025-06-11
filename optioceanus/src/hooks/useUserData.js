import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebaseConfig'; // Impor instance Firestore
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp, // Untuk timestamp
} from 'firebase/firestore';
import { useAuth } from '../AuthContext'; // Untuk mendapatkan currentUser

function useUserData() {
    const { currentUser } = useAuth();
    const [ships, setShips] = useState([]);
    const [loadingShips, setLoadingShips] = useState(true);
    const [errorShips, setErrorShips] = useState(null);

    // State untuk voyages
    const [voyages, setVoyages] = useState([]);
    const [loadingVoyages, setLoadingVoyages] = useState(true);
    const [errorVoyages, setErrorVoyages] = useState(null);

    // Mengambil data kapal milik pengguna saat ini
    useEffect(() => {
        if (!currentUser) {
            setShips([]);
            setLoadingShips(false);
            return;
        }

        setLoadingShips(true);
        setErrorShips(null);

        // Path ke sub-koleksi ships milik pengguna
        const shipsCollectionRef = collection(db, 'users', currentUser.uid, 'ships');
        const q = query(shipsCollectionRef); // Bisa ditambahkan orderBy jika perlu

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const shipsData = [];
            querySnapshot.forEach((doc) => {
                shipsData.push({ id: doc.id, ...doc.data() });
            });
            setShips(shipsData);
            setLoadingShips(false);
        }, (error) => {
            console.error("Error fetching ships: ", error);
            setErrorShips(error.message);
            setLoadingShips(false);
        });

        // Cleanup listener saat komponen unmount atau currentUser berubah
        return () => unsubscribe();
    }, [currentUser]);

    // Mengambil data voyages milik pengguna saat ini
    // Ini bisa dibuat lebih spesifik untuk mengambil voyages per kapal jika diperlukan
    useEffect(() => {
        if (!currentUser) {
            setVoyages([]);
            setLoadingVoyages(false);
            return;
        }

        setLoadingVoyages(true);
        setErrorVoyages(null);

        // Path ke koleksi voyages milik pengguna
        // Struktur: users/{userId}/voyages/{voyageId}
        const voyagesCollectionRef = collection(db, 'users', currentUser.uid, 'voyages');
        const q = query(voyagesCollectionRef); // Bisa ditambahkan orderBy('atd', 'desc') misalnya

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const voyagesData = [];
            querySnapshot.forEach((doc) => {
                voyagesData.push({ id: doc.id, ...doc.data() });
            });
            setVoyages(voyagesData);
            setLoadingVoyages(false);
        }, (error) => {
            console.error("Error fetching voyages: ", error);
            setErrorVoyages(error.message);
            setLoadingVoyages(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Fungsi untuk menambah kapal baru
    const addShip = useCallback(async (newShipData) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const shipsCollectionRef = collection(db, 'users', currentUser.uid, 'ships');
            await addDoc(shipsCollectionRef, {
                ...newShipData,
                createdAt: serverTimestamp(), // Tambahkan timestamp pembuatan
                userId: currentUser.uid, // Simpan userId untuk referensi
            });
            // Notifikasi bisa ditangani di komponen pemanggil atau di sini
            // alert(`Kapal "${newShipData.name}" berhasil ditambahkan!`);
        } catch (error) {
            console.error("Error adding ship: ", error);
            throw error; // Lempar error agar bisa ditangani di komponen
        }
    }, [currentUser]);

    // Fungsi untuk mengedit kapal
    const updateShip = useCallback(async (shipId, updatedShipData) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const shipDocRef = doc(db, 'users', currentUser.uid, 'ships', shipId);
            await updateDoc(shipDocRef, {
                ...updatedShipData,
                updatedAt: serverTimestamp(), // Tambahkan timestamp pembaruan
            });
            // alert(`Kapal "${updatedShipData.name}" berhasil diperbarui!`);
        } catch (error) {
            console.error("Error updating ship: ", error);
            throw error;
        }
    }, [currentUser]);

    // Fungsi untuk menghapus kapal
    const deleteShip = useCallback(async (shipId) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const shipDocRef = doc(db, 'users', currentUser.uid, 'ships', shipId);
            await deleteDoc(shipDocRef);
            // alert(`Kapal berhasil dihapus!`); // Nama kapal tidak langsung tersedia di sini
        } catch (error) {
            console.error("Error deleting ship: ", error);
            throw error;
        }
    }, [currentUser]);

    // Fungsi untuk menambah data perjalanan baru
    const addVoyage = useCallback(async (newVoyageData) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const voyagesCollectionRef = collection(db, 'users', currentUser.uid, 'voyages');
            await addDoc(voyagesCollectionRef, {
                ...newVoyageData,
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
            });
        } catch (error) {
            console.error("Error adding voyage: ", error);
            throw error;
        }
    }, [currentUser]);

    // Fungsi untuk mengedit data perjalanan
    const updateVoyage = useCallback(async (voyageId, updatedVoyageData) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const voyageDocRef = doc(db, 'users', currentUser.uid, 'voyages', voyageId);
            await updateDoc(voyageDocRef, {
                ...updatedVoyageData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error updating voyage: ", error);
            throw error;
        }
    }, [currentUser]);

    // Fungsi untuk menghapus data perjalanan
    const deleteVoyage = useCallback(async (voyageId) => {
        if (!currentUser) throw new Error("Pengguna tidak login.");
        try {
            const voyageDocRef = doc(db, 'users', currentUser.uid, 'voyages', voyageId);
            await deleteDoc(voyageDocRef);
        } catch (error) {
            console.error("Error deleting voyage: ", error);
            throw error;
        }
    }, [currentUser]);

    // Fungsi untuk mengambil voyages untuk kapal tertentu (jika diperlukan secara terpisah)
    // Ini bisa menjadi alternatif jika tidak ingin mengambil semua voyages sekaligus
    // const getVoyagesForShip = useCallback((shipId) => {
    //     return voyages.filter(voyage => voyage.shipId === shipId);
    // }, [voyages]);

    return {
        ships,
        loadingShips,
        errorShips,
        addShip,
        updateShip,
        deleteShip,
        voyages,
        loadingVoyages,
        errorVoyages,
        addVoyage,
        updateVoyage,
        deleteVoyage,
        // getVoyagesForShip,
    };
}

export default useUserData;