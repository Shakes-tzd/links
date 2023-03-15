
import { useEffect,useState } from "react";
import {ImageListType} from "react-images-uploading";
import supabase from "@/utils/supabaseClient";

type Link={
  title: string;
  url: string;
}

export default function Home() {
  const [isAuthenticated,setIsAuthenthicated] = useState<boolean>(false);
  const [userId, setUserId]=useState<string | undefined>();
  const [title,setTitle]=useState<string |undefined>();
  const [url,setUrl]=useState<string |undefined>();
  const [links, setLinks] =useState<Link[]>();
  const [images,setImages]=useState<ImageListType>([]);
  useEffect( ()=>{
    const getUser= async () =>{
      const user =await supabase.auth.getUser();
      //console.log("user",user)
      if(user) {
        const userId= user.data.user?.id;
        setIsAuthenthicated(true);
        setUserId(userId)
      }
    };
    getUser();
  }, []);
  useEffect(()=>{
    const getLinks = async ()=>{
      try {const {data,error} =await supabase
      .from('links')
      .select("title,url")
      .eq("user_id",userId);
      if(error) throw error;
      setLinks(data)
      //console.log("data ",data)
        
      } catch (error) {
        console.log(error)
        }};
        if (userId){
          getLinks()
        }
  },[userId]);//why passed in [userID]: anytime userId changes call run the entire useEffect
  const addNewLink = async ()=>{
    try{
      if(title && url && userId){
        const {data, error}= await supabase.from("links").insert({
          title:title,
          url:url,
          user_id:userId
        }).select();
        if(error) throw error;
        //console.log("data",data)
        if(links){
        setLinks([...data,...links]);}// [...data,...links] deconstructs the links array and the ...data combines all the elements within the data array 
    
    }} catch(error){
      console.log("error: ",error)
    }
   
    
  }
  return (
    <div className="flex flex-col w-full justify-center items-center">
      {links?.map((link:Link,index:number)=>(
        <div className="shadow-xl w-96 bg-indigo-500 mt-4 p-4 rounded-lg text-center text-white"
        key={index} 
        onClick={
          (e)=>{
            e.preventDefault();
            window.location.href=link.url;
          }
        }
        >{link.title}</div>
      ))}
      {isAuthenticated &&(
        <>
        <div 
          className="block text-sm font-medium leading-6 text-gray-900 mt-4 items-start">
            Title
          </div>
         <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="my awesome link"
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          <div
          className="block text-sm font-medium justify-start text-gray-900 mt-4 ">
            Link
          </div>
        <div className="mt-2">
            <input
              type="text"
              name="url"
              id="url"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="mylink.com"
              onChange={(e)=>setUrl(e.target.value)}
            />
          </div>

         
    <button
        type="button"
        className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
        onClick={addNewLink}
        >
        Add new link
      </button>
      </>
      )}
    </div>
    
  )
}
