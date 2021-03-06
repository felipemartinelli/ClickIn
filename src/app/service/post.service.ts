import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../model/Post';
import { Comentario } from '../model/Comentario';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(public http: HttpClient) { }


  public getAllPosts(){
    return this.http.get("http://localhost:8080/post/todos");
  }

  recuperaPostPeloID(id: number){
    return this.http.get("http://localhost:8080/post/"+id);
  }

  recuperaPostPelaPalavra(palavra: String){
    return this.http.get("http://localhost:8080/post/busca/?key="+palavra);
  }

  public inserePost(posts:Post){
    return this.http.post("http://localhost:8080/post/novo",posts);
  }

  public alteraPost(posts:Post){
    return this.http.put("http://localhost:8080/post/alterar",posts);
  }

  public insereComentario(comentario:Comentario){
    return this.http.post("http://localhost:8080/comentario/novo",comentario);
  }

  public excluirComentario(id: number){
    return this.http.delete("http://localhost:8080/post/deletar/"+id)
  }


}