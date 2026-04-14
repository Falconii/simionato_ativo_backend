select i.codigo
	       ,i.descricao 
	       ,n.nfe
	       ,n.serie
	       ,n.dtemissao
	       ,n.dtlancamento 
	from imobilizados i
	left join nfes n on 
	        n.id_empresa = i.id_empresa 
	    and n.id_filial  = i.id_filial 
	    and n.id_imobilizado = i.codigo
	    and n.nfe = i.nfe 
	    and n.serie = i.serie 
	    and n.item = i.item 
	where i.id_filial = 15 and  i.origem = 'P' order by i.codigo 
	