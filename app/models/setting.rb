class Setting < ActiveRecord::Base
  class SettingNotFound < RuntimeError;
  end

  cattr_accessor :defaults

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
    elsif @@defaults and @@defaults[key.to_s]
      @@defaults[key.to_s]
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
end
