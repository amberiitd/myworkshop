import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useSetState = (actionCreator, data)=>{
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionCreator(data))
  }, [data])
  return null;
}

export default useSetState;