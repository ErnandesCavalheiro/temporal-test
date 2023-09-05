const useAnalyzeComment = async () => {
    const possibles: { [key: number]: string } = {
        1: "Positive",
        2: "Neutral",
        3: "Negative"
    }

    const randomNumber = Math.floor(Math.random() * 3) + 1;
    const res = possibles[randomNumber];
    
    return res;
}

export default useAnalyzeComment;