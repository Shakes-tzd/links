import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import supabase from "@/utils/supabaseClient";
import { useEffect,useState } from "react";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isAuthenticated,setIsAuthenthicated] = useState<boolean>(false);
  const [userId, setUserId]=useState<string | undefined>();
  const [title,setTitle]=useState<string |undefined>();
  const [url,setUrl]=useState<string |undefined>();
  useEffect( ()=>{
    const getUser= async () =>{
      const user =await supabase.auth.getUser();
      console.log("user",user)
      if(user) {
        const userId= user.data.user?.id;
        setIsAuthenthicated(true);
        setUserId(userId)
      }
    };
    getUser();
  }, []);
  const addNewLink = async ()=>{
    try{
      if(title && url && userId){
        const {data, error}= await supabase.from("links").insert({
          title:title,
          url:url,
          user_id:userId
        });
        if(error) throw error;
        console.log("data",data)
      }
    } catch(error){
      console.log("error: ",error)
    }
   
    
  }
  return (
    <div className="flex flex-col w-full justify-center items-center">
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
