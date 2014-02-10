Klog2::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  root 'blogs#index'

  get 'blog/:id.html' => 'blogs#show', :as => :blog
  get 'blog/page/:page' => 'blogs#index'
  post 'blog/preview' => 'blogs#preview'

  resources :categories
  resources :tags
  get 'categories/:id/page/:page' => 'categories#show'
  get 'tags/:id/page/:page' => 'tags#show'

  get '/feed' => 'feed#show', :as => :feed, :defaults => {:format => 'rss'}
  get '/archive.html' => 'archive#show', :as => :archive
  get '/page/:id.html' => 'pages#show', :as => :page

  namespace :admin do
    get '/' => 'home#show'
    get '/dashboard' => 'dashboard#show'
    post '/dashboard/sync_comment' => 'dashboard#sync_comment'
    get '/dashboard/:action' => 'dashboard'

    resource :session

    resources :attaches
    resources :blogs do
      post 'publish', :on => :member
    end
    resources :categories
    resources :comments do
      get 'context', :on => :collection
    end
    resources :pages do
      member do
        post 'up'
        post 'down'
      end
    end
    resource :website
    resource :password
    resource :ga
    resource :disqus do
      put 'enable'
    end
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
