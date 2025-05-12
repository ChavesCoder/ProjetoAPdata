function listarVariacao(req, res) {
  try {
      // Decodifica e converte o parâmetro de cidades de volta para um array
      const cidades = JSON.parse(decodeURIComponent(req.query.cidades));
      const ano = req.params.ano;

      // Aqui você pode usar o model para buscar os dados
      variacaoMensalModel.buscarVariacaoMensal(cidades, ano)
          .then(function (resultado) {
              res.json(resultado);
          })
          .catch(function (erro) {
              console.log(erro);
              res.status(500).json(erro.sqlMessage);
          });
  } catch (erro) {
      console.error("Erro ao processar as cidades:", erro);
      res.status(400).json({ mensagem: "Erro ao processar as cidades." });
  }
}
