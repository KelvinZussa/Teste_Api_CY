/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
          return contrato.validateAsync(response.body)
        }) 

    });

    it('Deve listar usuários cadastrados', () => {
         cy.request({
          method: 'GET',
          url: 'usuarios',
         }).then((response) =>{
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(30)
            expect(response.status).to.equal(200)
         })
     

    });

    it('Deve cadastrar um usuário com sucesso', () => {
         cy.request({
            method: 'POST',
            url: 'usuarios',
            body:{
               "nome": (faker.person.firstName()),
               "email": (faker.internet.email()),
               "password": "teste",
               "administrador": "true"
             }
         }).then((response) => {
          expect(response.status).to.equal(201)
          expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })

     
    });

    it('Deve validar um usuário com email inválido', () => {
         cy.cadastrarUsuario('Kelvin Santos', 'kelvin@it.','teste', 'true')
         .then((response) => {
         expect(response.status).to.equal(400)
        expect(response.body.email).to.equal('email deve ser um email válido')
        expect(response.duration).to.be.lessThan(15)
         })

    });

    it('Deve editar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario((faker.person.firstName()), (faker.internet.email()), 'teste1', 'true')
          .then(response => {
          let id = response.body._id

          cy.request({
               method:'PUT',
               url: `usuarios/${id}`,
               body:{
                    "nome": (faker.person.firstName()),
                    "email": (faker.internet.email()),
                    "password": "teste",
                    "administrador": "true"

               }

          }).then(response => {
               expect(response.body.message).to.equal('Registro alterado com sucesso')
               expect(response.status).to.equal(200)
           })
     })



    });

    it('Deve deletar um usuário previamente cadastrado', () => {
     cy.cadastrarUsuario((faker.person.firstName()), (faker.internet.email()), 'teste1', 'true')
        .then(response => {
          let id = response.body._id
          cy.request({
               method: 'DELETE',
               url: `usuarios/${id}`,

          }).then(response =>{
               expect(response.body.message).to.equal('Registro excluído com sucesso')
               expect(response.status).to.equal(200)
           })

        })

        



    });


});
