import { useEffect } from "react";

function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title;
        console.log(`Judul dokumen diubah (via hook): ${title}`);
    }, [title])
}

export default useDocumentTitle;