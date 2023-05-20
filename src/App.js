import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
//<App/>
//className="App" center로 css에 지정됨 
//독립된 부품 -> 각 코드 활용성 증대 
//prop : react의 속성 
//event ex) button 누르면 경고문  
//prop은 component를 사용하는 외부자를 위한 data
//state은 component를 만드는 내부자를 위한 data

function Nav(props){
  const lis=[]
  for(let i=0;i<props.topics.length;i++){
    let t=props.topics[i];
    lis.push(<li key={t.id}>
      <a href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id)); //a tag의 id 값을 숫자로 가져옴 
      }}>{t.title}</a></li>)
    //unique한 key로 만들것 
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
function Create(props){
  return <article>
      <h2>Create</h2>
      <form onSubmit={event=>{
        event.preventDefault(); //create button으로 새로고침 방지
        const title=event.target.title.value; //event 발생 tag를 가리킴 : form 
        const body=event.target.body.value;
        props.onCreate(title,body);

      }}>
        <p><input type="text" name="title" placeholder="title"/></p>
        <p><textarea name="body" placeholder='body'></textarea></p>
        <p><input type="submit" value="Create"></input></p>

      </form>
  </article>
}
function Header(props){  //props 
  console.log('props',props,props.title);

  //사용자 정의 tag는 대문자로 시작
  return <header>
    <h1><a href="/" onClick={(event)=>{ 
      event.preventDefault(); //a tag의 기본 동작 방지 
      //click해도 reload x 
      props.onChangeMode(); //onClick시 onChangeMode가 가리키는 함수의 호출
    }}>{props.title}</a></h1>
  </header>
}
function Update(props){
  const [title,setTitle]=useStae(props.title);
  const[body,setBody]=useState(props.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title=event.target.title.value;
      const body=event.target.body.value;
      props.onUpdate(title,body);
    }}>
      <p><input type="text" name="title" placeholder='title' value={title} onChange={event=>{
        console.log(event.target.value);
        setTitle(event.target.value);

      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={(event=>{
        setBody(event.target.body.value);
      })}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
      
    </form>
  </article>
}
function App() {
  //const _mode=useState('WELCOME'); //0번째 원소 WELCOME(값 읽음), 1번째 원소: 함수(값 변경) 
  //const mode=_mode[0]; 
  //const setMode=_mode[1]; 

  const [mode,setMode]=useState('WELCOME'); //위 코드 축약 형태 
  const[id,setId]=useState(null);
  //useState object, array에 대해서 내용 복사 
  //const [nextId, setNextId]=useState(4);
  const[nextId,setNextId]=useState(4);
  const[topics,setTopics]=useState([ //지역변수를 상태로 업그레이드
    {id:1, title:'html',body:'html is...'},
    {id:2, title:'css',body:'css is...'},
    {id:3, title:'js',body:'javascript is...'}
  ]);
  const newTopics=[...topics]
  newTopics.push(newTopic);
  setTopics(newTopics);

  let content=null;
  let contextControl=null;
  if(mode==='WELCOME'){//event발생시 mode의 값 변경
    content=<Article title="welcome" body="hello, web"></Article>
  }
  else if(mode==='READ'){
    //content=<Article title="read" body="hello,read"></Article>
    let title,body=null;
    for(let i=0;i<topics.length;i++){
      console.log(topics[i]===id) //id state은 setId에서 옴 -> Nav안 a(tag의 속성이 되면 문자로 바뀜)
      if(topics[i].id===id){  //id state와 일치한다면
        title=topics[i].title; //title, body값을 setting 
        body=topics[i].body;

      }  
    }
    content=<Article title={title} body={body}></Article>
    contextControl=<>
    <li><a href={'/update/'+id onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');

    }}>Update</a></li>
    <li><input type="button" value="Delete" conClick={()=>{
      const newTopics=[]
      for(let i=0;i<topics.length;i++){
        if(topics[i].id!==id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }}/></li>

    </>
  } else if(mode==='CREATE'){
    content=<Create onCreate={(_title,_body)=>{

      const newTopic={id:nextId, title:_title, body:_body}
      const newTopics=[...topics]
      newTopics.push(newTopic);
      setTopics(newtopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);

    }}></Create>
   }else if(mode==='UPDATE'){
      content=<Update title={title} body={body} onUpdate={(title,body)=>{
        console.log(title,body);
        const updateTopic={id:title,body:body};
        for(let i=0;i<newTopics.length;i++){
          if(newTopics[i].id===id){
            newTopics[i]=updatedTopic;
            break;
          }
        }
        
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div > 
      <Header title="WEB" onChangeMode={()=>{
        //mode='WELCOME';
        setMode('WELCOME');
      }}></Header>

      <Nav topics={topics} onChangeMode={(_id)=>{
    
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        <li><a href="/update">Update</a></li>
        {contextControl}

      </ul>
    </div>
  );
}

export default App;
