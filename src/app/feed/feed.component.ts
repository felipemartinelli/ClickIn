import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { Post } from '../model/Post';
import { Router } from '@angular/router';
import { Globals } from '../model/Globals';
import { Usuario } from '../model/Usuario';
import { UsuarioService } from '../service/usuario.service';
import { Comentario } from '../model/Comentario';
import * as $ from 'jquery';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [Globals]
})
export class FeedComponent implements OnInit {

  now = new Date();
  usuario: Usuario;
  posts: Post[];
  _posts: Post[];
  comentarios: Comentario[];
  usuarios: Usuario[];
  public idBusca: number;
  public idPostagem;
  public _msgErro: string = null;
  public _post: Post = null;
  public vetorOunao: boolean = true;
  public textPost: string;
  public textPostModel: string;
  public textComentario: string;
  public palavraPesquisada: string;
  public post: Post = new Post();
  public comentario: Comentario = new Comentario();
  public i: number = 1;
  public idModal: number = 0;


  constructor(public postService: PostService, public router: Router, public srv: UsuarioService) { }



  ngOnInit() {

    if(localStorage.getItem("MyToken")){
        

        this.srv.buscarInfo(localStorage.getItem("MyToken")).subscribe(
          (res: Usuario) => {
            
                Globals.user = res;
                this.usuario = new Usuario();
                this.usuario.nome = res.nome;
                this.usuario.idUsuario = res.idUsuario;
                this.usuario.nomeFantasia = res.nomeFantasia;
                this.usuario.tipo = res.tipo;
                this.acharTodos();
          },   
        err => {
          console.log(err);
          alert("Erro ao inserir");
        });
      
    }else{     
      this.router.navigate(['/home']);
      alert("Você Precisa estar conectado para acessar essa página!")
      console.log(localStorage.getItem);
    }
  }

  acharTodos() {
    this._posts = null;
    this.postService.getAllPosts().subscribe((postOut: Post[]) => this.posts = postOut);
    console.log(this.posts);
    this.srv.recuperaPostsUsuario(this.usuario.idUsuario).subscribe((postOut: Usuario) => this.usuario = postOut);
  }

  acharComentariosUsuario(id: number){
    this.postService.recuperaPostPeloID(id).subscribe((postOut: Post) => this.post = postOut);
   // this.acharTodos();
  }

  enviarComentarios(id: number){

    if(this.textComentario !=null || this.textComentario != ""){
 
      this.comentario.texto = this.textComentario;
      this.comentario.dataComentario = this.now.toLocaleDateString();
      this.comentario.imagem = null;
      this.post.idPostagem = id;
      this.comentario.post = this.post;

      $('.hidden').css("display","none");
      
      console.log(id);
      console.log(this.post.idPostagem);

      console.log(this.comentario);

      this.postService.insereComentario(this.comentario).subscribe(
        res => {
          alert("inserido com sucesso!");
          this.acharComentariosUsuario(id);
          
        },
        err => {
          console.log(err);
          alert("Erro ao inserir");
        }
      
        )
      

    }
    else {
      alert("Não é possivel incluir um comentario em branco");
    }

  }

  enviarDados() {
    if (this.textPost != null || this.textPost != "") {

      this.post.texto = this.textPost;
      this.post.dataInclusao = this.now.toLocaleDateString();
      console.log(this.post.dataInclusao);
      this.post.imagem = null;
      this.post.usuario = this.usuario;

      this.postService.inserePost(this.post).subscribe(
        res => {
          this.acharTodos();
          
        },
        err => {
          console.log(err);
          alert("Erro ao inserir");
        }
      )
    }
    else {
      alert("Não é possivel incluir um texto em branco");
    }

  }


  public editar(id: number) {
    this.post.idPostagem = id;
    this.idModal = id;
    this.postService.recuperaPostPeloID(id).subscribe(
      (res: Post) => { 
        this.post.idPostagem = id; 
        this.textPostModel = res.texto; 
      },

      (err) => { alert("deu ruim!");
    });
    console.log(this.idModal);
  }

  enviarAlteracoes(id: number) {
    //this.post.idPostagem = id;;
    this.post.texto = this.textPostModel;
    this.post.dataInclusao = this.now.toLocaleDateString();

    

    console.log(this.post);
    this.postService.alteraPost(this.post).subscribe((res) => {
      alert("Atualizado com sucesso");
      this.acharTodos();
      $('#btnfecharLogin').click();
    },
      (err) => {
        alert("Erro ao atualizar");
        console.log(err);
        this.acharTodos();
        $('#btnfecharLogin').click();
      });

  }

  excluirPost(id: number){

    this.postService.excluirComentario(id).subscribe((res: string) =>{
      alert("Excluido com sucesso");
      this.acharTodos();
    },
    (err) => {
      alert("Excluido com sucesso");
      this.acharTodos();
    });

  }



  public pesquisar() {
    if (this.idBusca <= 0) {
      this._msgErro = "Digite um numero valido";
    }
    else {
      this._msgErro = null;
      this.postService.recuperaPostPeloID(this.idBusca).subscribe((res: Post) => {
        this._post = res;
        this.vetorOunao = false;
        console.log(this.vetorOunao);
        console.log(this._post);
      });
    }
  }

  public pesquisarPalavra() {

    this.srv.recuperaPostsUsuario(this.usuario.idUsuario).subscribe((postOut: Usuario) => this.usuario = postOut);
      this.postService.recuperaPostPelaPalavra(this.palavraPesquisada).subscribe((res: Post[]) => {
        this._posts = res;
        console.log(this._posts);
      
    });
  }

  public selecionarPerfil(){

    this.srv.recuperaUsuario(this.usuario.idUsuario).subscribe((usuario: Usuario) => this.usuario = usuario);

    console.log(this.usuario.tipo);

    if(this.usuario.tipo == "PF"){
      this.router.navigate(['/perfilpessoafisica']);
    }
    else{
      this.router.navigate(['/perfilpessoajuridica']);
    }

  }

  public logout(){
  if(localStorage.getItem("MyToken")){
    localStorage.removeItem("MyToken");
    this.router.navigate(['/home']);
  }else{
  this.router.navigate(['/home']);
  }
}

  public mostra(){
      $('.hidden').css("display","block");
  };

  public esconde(){
    $('.hidden').css("display","none");
};
}