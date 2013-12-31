require 'test_helper'

class BannerCellTest < Cell::TestCase
  test "show" do
    invoke :show
    assert_select "p"
  end
  

end
