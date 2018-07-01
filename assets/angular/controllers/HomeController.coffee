(->

	HomeController = () ->

		@CreatedText = 'Tadeu'

		@CreateNewText = () =>
			@CreatedText = 'Teed'
			return

		return

	angular
		.module 'app'
		.controller 'HomeController', HomeController

)()
