class Setting < ActiveRecord::Base
  class SettingNotFound < RuntimeError;
  end

  class_attribute :defaults

  #get or set a variable with the variable as the called method
  def self.method_missing(method, *args)
    method_name = method.to_s
    super(method, *args)

  rescue NoMethodError
    #set a value for a variable
    if method_name =~ /=$/
      key = method_name.gsub('=', '')
      value = args.first
      self[key] = value

      #retrieve a value
    else
      self[method_name]
    end
  end

  def self.all_vars(*keys)
    vars = Setting.all
    vars = vars.where(:key => keys) if keys.present?

    result = {}
    vars.each do |var|
      result[var.key] = var.value
    end
    result.with_indifferent_access
  end

  #destroy the specified settings record
  def self.destroy(key)
    if var = Setting.find_by(:key => key)
      var.destroy
      true
    else
      raise SettingNotFound, "Setting variable \"#{key}\" not found"
    end
  end

  #retrieve a setting value by [] notation
  def self.[](key)
    if var = Setting.find_by(:key => key)
      var.value
    elsif Setting.defaults and Setting.defaults[key.to_s]
      defaults[key.to_s]
    else
      nil
    end
  end

  #set a setting value by [] notation
  def self.[]=(key, value)
    record = Setting.find_or_create_by(:key => key.to_s)
    record.value = value
    record.save
  end

  def value
    # JSON.parse 无法处理 JSON 原始类型，hack it！
    JSON.parse("[#{self[:value]}]", :object_class => OpenStruct).first
  end

  # 使用 JSON 保存值
  def value=(new_value)
    new_value = new_value.marshal_dump if new_value.is_a? OpenStruct
    new_value.map! { |o| (o.is_a? OpenStruct) ? o.marshal_dump : o } if new_value.is_a? Array
    self[:value] = new_value.to_json
  end
end
