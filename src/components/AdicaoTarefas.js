import React, { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';


function AdicaoTarefas() {

  const [tarefaDefault, setTarefa] = useState({
    id: 0,
    nome: '',
    descricao: '',
    prazo: '',
    dataEntrega: null,
    concluida: false,
    diasParaPrazo: 0,
    diasEmAtraso: 0,
    alertaDiaFinal: false
  });

  const [tarefas, setTarefas] = useState([]);

  const [listaTarefasConcluidas, setTarefasConcluidas] = useState([]);

  const [listaTarefasEmProcesso, setTarefasEmProcesso] = useState([]);

  const [tarefaEditando, setTarefaEditando] = useState(null);

  const [mostrarTextoDefault, setMostrarTextoDefault] = useState(true); 

  const [mostrarModal, setMostrarModal] = useState(false); 

  const [mensagemModal, setMensagemModal] = useState(''); 

  const [mostrarDescricao, setMostrarDescricao] = useState(false); 

  const [textoDescricao, setTextoDescricao] = useState(''); 
  

  const setarCamposDefault = ((tarefaDefault) => {
    tarefaDefault.id = 0;
    tarefaDefault.nome = '';
    tarefaDefault.descricao = '';
    tarefaDefault.prazo = '';
    tarefaDefault.concluida = false;
    tarefaDefault.diasParaPrazo = 0;
    tarefaDefault.diasEmAtraso = 0;
    tarefaDefault.alertaDiaFinal = false;
    setTarefa(tarefaDefault);
  });

  const fecharModal = () => {
    setMostrarModal(false);
    setMensagemModal(''); 
  };

  const fecharModalDescricao = () => {
    setMostrarDescricao(false);
    setTextoDescricao(''); 
  };

  const obterTarefas = async () => {
    try {
      const response = await fetch('/api/Tarefas/Obter', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();   
        const novasConcluidas = data.filter(tarefa => tarefa.concluida);
        const novasEmProcesso = data.filter(tarefa => !tarefa.concluida);

        setTarefasConcluidas(novasConcluidas);
        setTarefasEmProcesso(novasEmProcesso);
      
        setTarefas(data); 
      } else {
        setMensagemModal(`Erro ao obter tarefas!`);
        setMostrarModal(true); 
      }
    } catch (e) {    
        setMensagemModal(`Erro ao obter tarefas!`);
        setMostrarModal(true); 
    }
  };

  useEffect(() => {
    obterTarefas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefa((prevTarefa) => ({
      ...prevTarefa,
      [name]: value,
    }));
  };

  const verificarCamposEaddTarefa = async () => {
      if(tarefaDefault.nome == "" || tarefaDefault.descricao == "" || tarefaDefault.prazo == ""){
        setMensagemModal(`Preencha todos os campos!`);
        setMostrarModal(true);
      }
      else{
        adicionarTarefa();
      }
  }

  const adicionarTarefa = async () => {
    try {
      const response = await fetch('api/Tarefas/Adicionar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefaDefault),
      });

      if (response.ok) {
        obterTarefas(); 
        setarCamposDefault(tarefaDefault);
      } else {

        setMensagemModal(`Erro ao adicionar tarefa!`);
        setMostrarModal(true);
      }
    } catch (error) {
      setMensagemModal(`Erro ao adicionar tarefa!`);
      setMostrarModal(true);
    }
  };

  const atualizarTarefa = async (tarefa) => {

    try {
      const response = await fetch('api/Tarefas/Atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
      });

      if (response.ok) {
        obterTarefas(); 
        setTarefaEditando(null); 
        setMostrarTextoDefault(true); 
      } else {
        setMensagemModal(`Erro ao atualizar tarefas!`);
        setMostrarModal(true);
      }
    } catch (error) {
      setMensagemModal(`Erro ao atualizar tarefas!`);
      setMostrarModal(true);
    }
  };

  const ExcluirTarefa = async (id) => {
    try {
      
      const response = await fetch(`/api/Tarefas/Excluir/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        obterTarefas(); 
      
      } else {
        setMensagemModal(`Erro ao excluir tarefa!`);
        setMostrarModal(true);
      }
    } catch (error) {
      setMensagemModal(`Erro ao excluir tarefa!`);
      setMostrarModal(true);
    }
  };

  const iniciarEdicao = (task) => {
    setMostrarTextoDefault(false); 
    setTarefaEditando(task);
  };

  const toggleConcluida = async (task) => {
    const tarefaAtualizada = { ...task, concluida: !task.concluida };
    tarefaAtualizada.concluida = true;
    atualizarTarefa(tarefaAtualizada);
  };

  const mostrarDescricaoTarefa =  (tarefa) => {
    setTextoDescricao(tarefa.descricao);
    setMostrarDescricao(true);
    
  };


  return (
    <section className='fonteGeral'>
      <header className='tituloGerenTarefas'>
        Gerenciamento de tarefas
      </header>
      {mostrarModal && (
        <div className="modal-overlay">
            
          <div className="modal-content">
            <div className='divModal'>
            <div>Atenção!</div>
              <button className='botaoFecharModal' onClick={fecharModal}>X</button>
            </div>
            <div >
              <p className='msgModal'>{mensagemModal}</p>             
            </div>        
          </div>
        </div>
      )}

      {mostrarDescricao && (
        <div className="modal-overlay">
            
          <div className="modal-content-descricao">
            <div className='divModal'>
            <div>Descrição da tarefa:</div>
              <button className='botaoFecharModal' onClick={fecharModalDescricao}>X</button>
            </div>
            <div >
              <p className='msgModal'>{textoDescricao}</p>             
            </div>        
          </div>
        </div>
      )}


      <section className='janelasGereciamento'>
          <div className='parte1Geren rowGeren'>
            <div className='criacaoDeTarefas janelaGeren estruturaTarefas'>            
              <div className='caixaTitulo'>
                <div className='titulos'>
                  Criação de tarefas
                </div>
              </div>
              <div className='divAddTarefas '>
                <div className='addTarefas_'>
                  <div className='tarefa_'>
                    <div className='tituloTarefa_ '>
                    <input className='inputDefault inputTituloTarefa' type="text" name="nome" placeholder="Título" value={tarefaDefault.nome} onChange={handleInputChange}/>
                    </div>
                    <div className='descricaoTarefa_'>
                      <textarea className='inputDescricao inputDefault'  type="text" name="descricao" placeholder="Descrição" value={tarefaDefault.descricao} onChange={handleInputChange}/>
                    </div>
                    <div className='divPrazoBotao'>
                      <div className='divDataInputPrazo'>
                          <div className='textPrazoEntrega'>Prazo para entrega</div>
                            <div className='inputDataPrazo'>
                              <input className='dataPrazo' type= "date" name="prazo" placeholder="prazo de entrega" value={tarefaDefault.prazo} onChange={handleInputChange}/>
                            </div>             
                          </div>
                          <div className='divBotaoAdd_'>
                            <button href="#" className="btn btn-white btn-animate botaoAdd"  onClick={() => verificarCamposEaddTarefa()}>
                                Adicionar Tarefa
                              <img className='imagemAdd'
                                src="/assents/plus-circle.svg"  
                                alt="Add" 
                                style={{ width: '16px', marginRight: '8px' }}  
                              />
                            </button>
                          </div>
                      </div>         
                    </div>
            </div>
          </div>
          </div>
            <div className='tarefasEmProcesso janelaGeren'>
              <div className='caixaTitulo'>
                  <div className='titulos'>
                    Tarefas em processo
                  </div>             
              </div>
              <div className='tarefasCriadas_'>
                <ul className='listaTarefas'>
                  {listaTarefasEmProcesso.map((task, index) => (          
                    <li key={index} >

                      <div className='tarefaCriadaDiv_'>
                        <div className='divId_botoes'>
                          <div className='itemTarefaProcesso identificador'>
                            Identificador - {task.id}
                          </div>
                          <div className='botoesEdicao'>
                            <div className='itemTarefaProcesso'>
                              <button className='botaoEditar'  onClick={() => iniciarEdicao(task)}>Editar</button>
                            </div>
                            <div className='itemTarefaProcesso'>
                              <button className='botaoExcluir' onClick={() => ExcluirTarefa(task.id)}>Excluir</button>
                            </div>
                          </div>
                        </div>
                        <div className='divItensTarefas'>  
                          <div className='itemTarefaProcesso nomeTarefa'>
                            {task.nome}
                          </div>
                                     
                        </div>  
                        <div className='prazos espacamento'>
                          <div className='itemTarefaProcesso prazoFinal'>
                            <div className='imagemPrazoFinal'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" className="bi bi-stopwatch" viewBox="0 0 16 16">
                                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z"/>
                                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3"/>
                              </svg>
                            </div>                         
                            Prazo final - {new Date(task.prazo).toLocaleDateString('pt-BR')}</div>
                            <div className='alertaDataParazo'>
                              <div className='imagemAlerta'>
                              {task.diasParaPrazo > 0 ? 
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" className="bi bi-calendar4" viewBox="0 0 16 16">
                              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="yellow" className="bi bi-exclamation-triangle" viewBox="0 0 16 16" >
                            <path fill="yellow"  d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                            <path fill="yellow"  d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                            </svg>
                            }            
                              </div>
                              {task.alertaDiaFinal ? (
                                <div className='itemTarefaProcesso textoAlerta' style={{color:'yellow'}}>Último dia para entrega!</div>
                                ) : task.diasEmAtraso > 0 ? 
                                (<div className='itemTarefaProcesso' style={{color:'red'}}>
                                    Dias em atraso: {task.diasEmAtraso}
                                  </div>):
                                (<div className='itemTarefaProcesso'>Dias restantes: {task.diasParaPrazo}</div>)
                              }
                            </div>           
                        </div>  
                        <div className='divConcluirTarefa_Detalhes'> 
                          <button className='botaoDetalhes' onClick={() => mostrarDescricaoTarefa(task)}>Descrição</button>
                          <div className='itemTarefaProcesso espacamento concluirTarefa'>      
                          <div className='concluirTarefa'><FaCheck onClick={() => toggleConcluida(task)}
                              style={{ 
                                color: 'green', 
                                cursor: 'pointer', 
                                marginRight: '8px' ,
                                border: '1px solid white',
                                padding: '1.1px',
                                borderRadius: '3px'
                              }} 
                            />
                            <div className='concluir'>{task.concluida ? 'Concluída' : 'Concluir tarefa'}</div>
                          </div> 
                        </div> 

                        </div>                
                      </div>     
                    </li>
                  ))}
              </ul>
              </div>  
            </div>
          </div>
          <div className='parte2Geren rowGeren'>
            <div className='tarefasConcluidas janelaGeren'>
              <div className='caixaTitulo'>
                  <div className='titulos'>
                    Tarefas concluídas
                  </div>             
              </div>
              <div className='tarefasCriadas_'>
                <ul className='listaTarefas'>
                  {listaTarefasConcluidas.map((task, index) => (          
                    <li key={index} >

                      <div className='tarefaCriadaDiv_'>
                        <div className='divId_botoes'>
                          <div className='itemTarefaProcesso identificador'>
                            Identificador - {task.id}
                          </div>
                        </div>
                        
                        {/* // */}
                          <div className='divItensTarefas div tarefaConcluida'>  
                            <div className='itemTarefaProcesso nomeTarefa'>
                              {task.nome}
                            </div>        
                            <div className='itemTarefaProcesso espacamento concluirTarefa divDetalhes_dataConclusao'>
                              <button className='botaoDetalhes' onClick={() => mostrarDescricaoTarefa(task)}>Descrição</button>
                              <div className='concluidaEm'>
                                Concluída em: 
                                <div className=''>{task.dataEntrega != null ? 
                                  new Date(task.dataEntrega).toLocaleDateString('pt-BR') : ''}
                                </div>
                              </div> 
                            </div>           
                        </div>                      
                      </div>     
                    </li>
                  ))}
              </ul>
              </div> 
            </div>
            <div className='tarefasConcluidas janelaGeren'>
                <div className='caixaTitulo'>
                  <div className='titulos'>
                    Edição de tarefa
                  </div>            
                </div>
                {mostrarTextoDefault ? (  
                  <div id='textoDefaultEdicao' className='textoDefault'>
                    <div className='textMsgEditar'>Click no botão 'Editar' da tarefa que deseja realizar modificações!</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                  </div>) :  <div></div>}
              
                {tarefaEditando && (             
                  <div className='addTarefas_'>         
                      <div className='tarefa_'>
                        <div className='tituloTarefa_ '>
                          <input className='inputDefault inputTituloTarefa' type="text" name="nome" placeholder="Título" value={tarefaEditando.nome} onChange={(e) => setTarefaEditando({ ...tarefaEditando, nome: e.target.value })} />
                        </div>
                        <div className='descricaoTarefa_'>
                          <textarea className='inputDescricao inputDefault'  type="text" name="descricao" placeholder="Descrição" value={tarefaEditando.descricao} onChange={handleInputChange}/>
                      </div>
                      <div className='divPrazoBotao'>
                      <div className='divDataInputPrazo'>
                          <div className='textPrazoEntrega'>Prazo para entrega</div>
                            <div className='inputDataPrazo'>
                              <input className='dataPrazo' type= "date" name="prazo" placeholder="prazo de entrega" value={tarefaEditando.prazo} onChange={(e) => setTarefaEditando({ ...tarefaEditando, prazo: e.target.value })}/>
                            </div>             
                          </div>
                          <div className='divBotaoAdd_'>
                            <button href="#" className="btn btn-white btn-animate botaoAtualizar"  onClick={() => atualizarTarefa(tarefaEditando)}>
                            Atualizar
                            </button>
                          </div>
                      </div>                     
                  </div>
                  </div>
                )}
            </div>
          </div>
      </section>

    </section>
  );
}

export default AdicaoTarefas;
